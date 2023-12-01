import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';

const CardDeck = (props) => {
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (props.currentDeck) {
      setDeck(props.currentDeck.cards);
    }
  }, [props.currentDeck]);

  const handleCardAnswer = (cardId, qualityOfAnswer) => {
    // TODO: implement SM-2 algorithm
    // TODO: store quality of answer
    setCurrentIndex((prevIndex) => (prevIndex + 1) % deck.length);
  };

  const currentCard = deck[currentIndex];

  return currentCard ? (
      <Flashcard card={currentCard} onAnswer={handleCardAnswer} />
  ) : (
    <div>Loading deck...</div>
  );
};

export default CardDeck;