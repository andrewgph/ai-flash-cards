# Flash Card Generation

The flash_card_gen.py script is designed to extract flash cards from a textbook pdf. It looks for a description of the book chapters and then creates flash cards for each chapter. This is a work in progress so the prompts used to generate flash cards may not work reliably. It's hopefully a useful starting point in case you want to extract flash cards interactively in a jupyter notebook.

## Running the Script

Install requirements using the following:

```
pip install -r requirements.txt
```

The OCR dependencies require installing some additional tools. On macos you can use the following brew command:

```
brew install freetype imagemagick 
```

You need to export the environment variables for the script:

```
export OPENAI_API_KEY=...
export MAGICK_HOME=...
```

The MAGICK_HOME environment variable needs to be explicitly exported, not sure why, might be specific to my environment.

Then you can run the flash_card_gen.py script with the following arguments:

```
python flash_card_gen.py --use_ocr --pdf_input <pdf_input> --json_output <json_output>
```