import './App.css';
import React, { useState } from 'react';
import FileLoader from './utils/FileLoader';
import CardDeck from './components/CardDeck';

const App = () => {
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFileLoaderVisible, setIsFileLoaderVisible] = useState(false);

  const handleNewCard = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const handleLoadDeck = async () => {
    setIsFileLoaderVisible(true);
    // const loadedDeck = await loadDeck();
    // setCurrentDeck(loadedDeck);
  };

  return (
    <div className="App">
      <div className="rectangle"> {/* Use the rectangle class */}
        {currentDeck ? <div>{currentDeck.title}</div> : <div>Load a new deck</div>}
      </div>
      <CardDeck onNewCard={handleNewCard} currentIndex={currentIndex} onLoadDeck={handleLoadDeck} currentDeck={currentDeck} />
      <div className="rectangle"> {/* Use the rectangle class */}
        <button onClick={handleNewCard}>Show New Card</button>
        <button onClick={handleLoadDeck}>Load Deck</button>
        {isFileLoaderVisible && <FileLoader onFileLoaded={(deck) => { setCurrentDeck(deck); setIsFileLoaderVisible(false); }} />} {/* Render FileLoader conditionally */}      </div>
    </div>
  );
};

export default App;