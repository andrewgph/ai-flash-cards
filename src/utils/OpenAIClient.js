const systemMessage = `You are a helpful assistant 
grading someones knowledge of a topic.`;

const userMessageFn = (card, answer) => `
Grade a user's answer to a flashcard with front content:

${card.front}.

And expected answer in the back content:

${card.back}.

User answer:

${answer}

Choose a grade from 0 to 5 where 0 is the worst grade and 5 is the best grade using the following rubric:

0: "Total blackout", complete failure to recall the information.
1: Incorrect response, but upon seeing the correct answer it felt familiar to the user.
2: Incorrect response, but upon seeing the correct answer it seemed easy to remember to the user.
3: Correct response, but required significant effort to recall by the user.
4: Correct response, after some hesitation by the user.
5: Correct response with perfect recall by the user.

Only return the grade. No explanation is needed.
`.trim();

class OpenAIClient {
    constructor(apiKey) {
      this.apiKey = apiKey;
    }
  
    async gradeAnswer(card, answer) {
        try {
            console.log('Making OpenAI request');

            // TODO: should restrict possible answers to the 0-5 range using logit_bias
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'gpt-4-1106-preview',
                messages: [
                  {
                    role: 'system',
                    content: systemMessage
                  },
                  {
                    role: 'user',
                    content: userMessageFn(card, answer)
                  }
                ]
              })
            });

            console.log('Made OpenAI request');

            const data = await response.json();

            var grade =  data.choices[0].message.content.trim();

            console.log('Got OpenAI response:', grade);

            if (!["0", "1", "2", "3", "4", "5"].includes(grade)) {
                throw new Error(`Invalid grade: ${grade}`);
            }
            grade = parseInt(grade);

            return grade;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async transcribeAudio(audioBlob) {
      // Assuming 'data' is a Blob or File object containing the audio data
      const formData = new FormData();
      formData.append('file', audioBlob);  // 'data' should be a Blob or File object
      formData.append('model', 'whisper-1');

      try {
          console.log('Making OpenAI request');
          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${this.apiKey}`,
                  // Don't set Content-Type header for FormData,
                  // as the browser will set it with the correct boundary
              },
              body: formData
          });
          console.log('Made OpenAI request');

          const data = await response.json();
          console.log(data);

          console.log('Got OpenAI response:', data);

          return data.text;
      } catch (error) {
          console.error('Error:', error);
      }
    }
}

export default OpenAIClient;