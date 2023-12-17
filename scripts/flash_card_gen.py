import argparse
import openai
import os
import PyPDF2
# TODO: make sure MAGICK_HOME is set before this import
# Should only import this if we are using OCR
from wand.image import Image
from PIL import Image as PilImage
import pytesseract
import io
import tempfile
import concurrent.futures
import json
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
)

openai_client = openai.OpenAI()

def delete_temp_dir(temp_dir):
    os.remove(os.path.join(temp_dir, "output.tiff"))
    if not os.listdir(temp_dir):
        os.rmdir(temp_dir) 
        print("Deleted temp dir: ", temp_dir)
    else:
        raise Exception("Temp dir not empty: " + temp_dir)

def pdf_to_tiff(pdf_file, temp_dir):
    # Settings chosen to lower tiff file size without sacrificing too much quality for OCR
    with Image(filename=pdf_file, resolution=200) as img:
        img.compression_quality = 80
        img.type = 'grayscale' 
        img.compression = 'jpeg'
        tiff_file_path = os.path.join(temp_dir, "output.tiff")
        img.save(filename=tiff_file_path)
    return tiff_file_path

def process_page(page_number, page):
    with Image(page) as single_page:
        with io.BytesIO() as output:
            single_page.save(file=output)
            output.seek(0)
            pil_image = PilImage.open(output)
            return page_number, pytesseract.image_to_string(pil_image)

def tiff_to_page_text(tiff_file):
    page_to_text = dict()
    with Image(filename=tiff_file) as img:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [executor.submit(process_page, i, page) for i, page in enumerate(img.sequence)]
            for future in concurrent.futures.as_completed(futures):
                page_number, page_text = future.result()
                page_to_text[page_number] = page_text
    return page_to_text

def read_pdf_pages_ocr(pdf_path):
    temp_dir = tempfile.mkdtemp(dir="/tmp")
    print("Using temp dir: ", temp_dir)
    tiff_files = pdf_to_tiff(pdf_path, temp_dir)
    page_to_text = tiff_to_page_text(tiff_files)
    delete_temp_dir(temp_dir)
    return page_to_text

def read_pdf_pages(pdf_path):
    page_to_text = dict()
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfFileReader(file)
        for page_num in range(pdf_reader.getNumPages()):
            page = pdf_reader.getPage(page_num)
            page_to_text[page_num] = page.extractText()
    return page_to_text

CONTENT_PAGE_SYSTEM_PROMPT = """
You are a student trying to identify the chapters in a textbook.
""".strip()

CONTENT_PAGE_USER_TEMPLATE = """
Given the following contents pages from a textbook.

{contents_pages}
""".strip()

CONTENTS_JSON_INSTRUCTIONS = """
Identify the chapter names and the first pages of each chapter.
Ignore any summarized contents and focus on identifying the main numbered chapters in the book.
Include an entry for the estimated last page of chapter content in the book, before any appendices or index.
Output the information in a JSON format with the following structure:

{
  "chapter 1 name": page_number,
  "chapter 2 name": page_number,
  ...
  "chapter n name": page_number,
  "last page": page_number
}

Only output the JSON object, do not say anything else.
""".strip()

def find_contents_pages(page_to_text):
    contents_pages = []
    for page_number, page_text in page_to_text.items():
        if "contents" in page_text.lower():
            contents_pages.append(page_number)
    return contents_pages

def generate_chapter_json(page_to_text):
    contents_pages = find_contents_pages(page_to_text)
    contents_pages_text = "\n".join([page_to_text[i] for i in contents_pages])

    user_prompt = CONTENT_PAGE_USER_TEMPLATE.format(contents_pages=contents_pages_text) + "\n\n" + CONTENTS_JSON_INSTRUCTIONS

    response = openai_client.chat.completions.create(
        model="gpt-4-1106-preview",
        response_format={ "type": "json_object" },
        messages=[{
            "role": "system", "content": CONTENT_PAGE_SYSTEM_PROMPT,
            "role": "user", "content": user_prompt
        }],
    )

    chapters_json = json.loads(response.choices[0].message.content)
    return chapters_json

FLASH_CARD_SYSTEM_PROMPT = """
You are a student who is trying to memorize the fundamental concepts introduced in a textbook.
Generate flash cards with any important concepts from the following pdf text content.
The pdf might be poorly formatted, so you should first identify valid text in the input.
Only include cards for concepts which are very important and worth memorizing.
""".strip()

FLASH_CARD_JSON_INSTRUCTIONS = """
The flash cards should be in a JSON format with the following structure:

{
   "cards": [
        {
            "fromt": "Concept",
            "back": "Summarized definition"
        },
        ...
   ]
}

Only output the JSON object, do not say anything else.
Return an empty json array if no new concepts are introduced on the page.
""".strip()

FLASH_CARD_USER_TEMPLATE = """
Generate flash card json from the following chapter in a textbook:

{chapter_content}
""".strip()

@retry(wait=wait_exponential(multiplier=14, max=3600), stop=stop_after_attempt(8))
def generate_flash_cards_from_chapter(chapter_text):
    user_prompt = FLASH_CARD_USER_TEMPLATE.format(
        chapter_content=chapter_text,
    ) + FLASH_CARD_JSON_INSTRUCTIONS
    response = openai_client.chat.completions.create(
        model="gpt-4-1106-preview",
        response_format={ "type": "json_object" },
        messages=[{
            "role": "system", "content": FLASH_CARD_SYSTEM_PROMPT,
            "role": "user", "content": user_prompt
        }],
    )
    print(response)
    json_content = json.loads(response.choices[0].message.content)
    return json_content

def generate_flash_cards_from_text(page_to_text):
    flash_cards = []
    
    chapters_json = generate_chapter_json(page_to_text)
    print("Using chapters: ", chapters_json)
    chapters_list = sorted(list(chapters_json.items()), key=lambda x: x[1])
    
    for i in range(len(chapters_list) - 1):
        chapter_name, first_page_number = chapters_list[i]
        _, next_first_page_number = chapters_list[i+1]
        print(f"{chapter_name}: {first_page_number} - {next_first_page_number - 1}")
        chapter_text = "\n".join([page_to_text[i] for i in range(first_page_number, next_first_page_number)])

        flash_card_json = generate_flash_cards_from_chapter(chapter_text)
        print("Flash cards for chapter: ", flash_card_json)
        if flash_card_json:
            flash_cards.extend(flash_card_json["cards"])

    return {
        "cards": flash_cards
    }

# TODO: Add a page range argument to ignore irrelevant pages in the PDF
def parse_args():
    parser = argparse.ArgumentParser(description='Generate flash cards from a PDF.')
    parser.add_argument('--pdf_input', type=str, required=True, help='Path to the PDF file.')
    parser.add_argument('--json_output', type=str, required=True, help='Path to use to write the JSON output')
    parser.add_argument('--use_ocr', action='store_true', help='Use OCR for PDF parsing')
    args = parser.parse_args()
    return args

def main():
    args = parse_args()
    if args.use_ocr:
        page_to_text = read_pdf_pages_ocr(args.pdf_input)
    else:
        page_to_text = read_pdf_pages(args.pdf_input)

    response = generate_flash_cards_from_text(page_to_text)

    with open(args.json_output, 'w') as f:
        json.dump(response, f)

if __name__ == "__main__":
    main()