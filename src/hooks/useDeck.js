import { useState, useEffect } from 'react';

const useDeck = () => {
  const [currentDeck, setCurrentDeck] = useState(null);

  const loadDeck = (deck) => {
    setCurrentDeck(deck);
    localStorage.setItem('aiFlashCards.deck', JSON.stringify(deck));
  };

  const clearDeck = () => {
    setCurrentDeck(null);
    localStorage.removeItem('aiFlashCards.deck');
  };

  useEffect(() => {
    const deck = localStorage.getItem('aiFlashCards.deck');
    if (deck) {
      const parsedDeck = JSON.parse(deck);
      setCurrentDeck(parsedDeck);
    }
  }, []);

  return { currentDeck, loadDeck, clearDeck };
};

export default useDeck;