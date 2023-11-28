import './App.css';
import React, { useState } from 'react';
import { loadDeck } from './utils/deckLoader';
import CardDeck from './components/CardDeck';

const App = () => {
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNewCard = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const handleLoadDeck = async () => {
    const loadedDeck = await loadDeck();
    setCurrentDeck(loadedDeck);
  };

  return (
    <div className="App">
      <div className="rectangle"> {/* Use the rectangle class */}
        {currentDeck ? <div>{currentDeck.title}</div> : <div>Load a new deck</div>}
      </div>
      <CardDeck onNewCard={handleNewCard} currentIndex={currentIndex} onLoadDeck={handleLoadDeck} />
      <div className="rectangle"> {/* Use the rectangle class */}
        <button onClick={handleNewCard}>Show New Card</button>
        <button onClick={handleLoadDeck}>Load Different Deck</button>
      </div>
    </div>
  );
};

export default App;