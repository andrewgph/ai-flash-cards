import './App.css';
import React, { useState } from 'react';
import FileLoader from './utils/FileLoader';
import CardDeck from './components/CardDeck';

const App = () => {
  const [currentDeck, setCurrentDeck] = useState(null);
  const [isFileLoaderVisible, setIsFileLoaderVisible] = useState(false);

  const showFileLoader = async () => {
    setIsFileLoaderVisible(true);
    // const loadedDeck = await loadDeck();
    // setCurrentDeck(loadedDeck);
  };

  return (
    <div className="App">
      <div className="rectangle">
        {currentDeck ? <div>{currentDeck.title}</div> : <div>Load a new deck</div>}
      </div>
      <div className="rectangle">
        <CardDeck currentDeck={currentDeck} />
      </div>
      <div className="rectangle">
        <button onClick={showFileLoader}>Load Deck</button>
        {isFileLoaderVisible && 
          <div className="overlay">
            <FileLoader onFileLoaded={(deck) => { setCurrentDeck(deck); setIsFileLoaderVisible(false); }} />
          </div>
        }
      </div>
    </div>
  );
};

export default App;