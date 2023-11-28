import React, { useState, useEffect } from 'react';
import { loadDeck } from '../utils/deckLoader';
import Flashcard from './Flashcard';

const CardDeck = (props) => {
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState(''); // Add this line

  useEffect(() => {
    const fetchDeck = async () => {
      const loadedDeck = await loadDeck();
      setDeck(loadedDeck.cards);
      setTitle(loadedDeck.title);
      props.onLoadDeck(loadedDeck); // Add this line
    };
  
    fetchDeck();
  }, []);

  const handleCardAnswer = (cardId, qualityOfAnswer) => {
    // TODO: implement SM-2 algorithm
    // TODO: store quality of answer
    setCurrentIndex((prevIndex) => (prevIndex + 1) % deck.length);
  };

  const currentCard = deck[currentIndex];

  return currentCard ? (
    <div className="rectangle"> {/* Use the rectangle class */}
      {/* <h2>{title}</h2> */}
      <Flashcard card={currentCard} onAnswer={handleCardAnswer} />
    </div>
  ) : (
    <div>Loading deck...</div>
  );
};

export default CardDeck;