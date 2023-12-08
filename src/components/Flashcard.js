import React, { useState, useEffect, useRef } from 'react';

const mimeType = "audio/mp3";

const Flashcard = ({ card, onAnswer, onTextAnswer, openAIClient }) => {
  const [showBack, setShowBack] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState('');

  const mediaRecorder = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioURL, setAudioURL] = useState('');

  useEffect(() => {
   if (openAIClient) {
      openAIClient.textToSpeech(card.front).then(audioBlob => {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }).catch(error => {
        console.error('Error transcribing audio:', error);
      });
   }
  }, [card]); // Dependencies

  const startRecording = async () => {
    console.log('Getting permissions to record');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    console.log('starting recording');
    setIsRecording(true);
    const media = new MediaRecorder(stream, {
      type: mimeType,
    });
    mediaRecorder.current = media;
  
    const localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);

    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    console.log('stopping recording');
    setIsRecording(false);
    if (!mediaRecorder.current) return;

    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      setAudioChunks([]);
      const file = new File([audioBlob], `file${Date.now()}.mp3`, { type: mimeType });

      if (!openAIClient) {
        console.log('No OpenAI client so not transcribing audio');
        return;
      }

      openAIClient.transcribeAudio(file).then(text => {
        console.log('transcribed audio:', text);
        onTextAnswer(card.id, text);
      }).catch(error => {
        console.error('Error transcribing audio:', error);
      });
    };
  };

  const handleUserInput = (qualityOfAnswer) => {
    setShowBack(false); // Switch back to front of card
    onAnswer(card.id, qualityOfAnswer);
  };

  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  const handleButtonClick = () => {
    // TODO: should show the back of the card for a limiited time
    onTextAnswer(card.id, textAreaValue);
  };

  return (
    <div>
      {showBack ? (
        <div>
          <div className="flex items-center justify-center p-4 text-blue-800">{card.back}</div>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" onClick={() => handleUserInput('Easy')}>Easy</button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-700" onClick={() => handleUserInput('Good')}>Good</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={() => handleUserInput('Hard')}>Hard</button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700" onClick={() => handleUserInput('Again')}>Again</button>
          </div>
        </div>
      ) : (
        <div>
          <div onClick={() => setShowBack(true)} className="flex items-center justify-center p-4 text-blue-800">
            {card.front}
          </div>
          {openAIClient && (
            <div className="flex flex-col items-center justify-center p-4 text-blue-800">
              <div className="w-full">
                <textarea className="w-full h-24 p-2 border rounded resize-y" placeholder="Optional answer" value={textAreaValue} onChange={handleTextAreaChange}></textarea>
              </div>
              <div className="flex justify-center mt-2">
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" onClick={handleButtonClick} title="Submits the text input for grading">Submit</button>
              </div>
              <div className="flex justify-center mt-2">
                <button className="px-4 py-2 bg-blue-300 text-white rounded hover:bg-blue-500" title="Record voice input for grading" onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? 'End Recording' : 'Begin Recording'}
                </button>
                {/* {audioURL && <audio src={audioURL} controls />} */}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Flashcard;
