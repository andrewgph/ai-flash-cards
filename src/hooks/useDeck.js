import { useState, useEffect } from 'react';

const useDeck = () => {
  const [currentDeck, setCurrentDeck] = useState(null);

  const loadDeck = (deck) => {
    setCurrentDeck(deck);
    localStorage.setItem('aiFlashCards.deck', JSON.stringify(deck));
  };

  const saveDeck = (deck) => {
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
      if (parsedDeck.cards && parsedDeck.cards.length > 0) {
        setCurrentDeck(parsedDeck);
      } else {
        console.log('Found deck in local storage, but it was empty.');
      }
    }
  }, []);

  return { currentDeck, loadDeck, clearDeck, saveDeck };
};

export default useDeck;