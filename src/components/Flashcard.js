import React, { useState } from 'react';

const Flashcard = ({ card, onAnswer }) => {
  const [showBack, setShowBack] = useState(false);

  const handleUserInput = (qualityOfAnswer) => {
    setShowBack(false); // Hide back of the card
    onAnswer(card.id, qualityOfAnswer);
  };

  return (
    <div>
      {showBack ? (
        <div>
          <div>{card.back}</div>
          <button onClick={() => handleUserInput('Easy')}>Easy</button>
          <button onClick={() => handleUserInput('Good')}>Good</button>
          <button onClick={() => handleUserInput('Hard')}>Hard</button>
          <button onClick={() => handleUserInput('Again')}>Again</button>
        </div>
      ) : (
        <div onClick={() => setShowBack(true)}>{card.front}</div>
      )}
    </div>
  );
};

export default Flashcard;
