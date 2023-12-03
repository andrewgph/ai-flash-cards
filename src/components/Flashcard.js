import React, { useState } from 'react';

const Flashcard = ({ card, onAnswer, onTextAnswer }) => {
  const [showBack, setShowBack] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState('');

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
          <div className="flex items-center justify-center p-4 text-blue-800">
            <textarea className="w-full h-24 p-2 border rounded resize-y" placeholder="Optional answer" value={textAreaValue} onChange={handleTextAreaChange}></textarea>
            <div className="flex justify-center mt-2">
              <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700" onClick={handleButtonClick}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
