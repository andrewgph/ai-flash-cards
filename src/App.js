import './App.css';
import './tailwind.css';
import React, { useState, useEffect } from 'react';
import FileLoader from './utils/FileLoader';
import CardDeck from './components/CardDeck';

const App = () => {
  const [currentDeck, setCurrentDeck] = useState(null);
  const [isFileLoaderVisible, setIsFileLoaderVisible] = useState(false);

  useEffect(() => {
    const deck = localStorage.getItem('aiFlashCards.deck');
    if (deck) {
      const parsedDeck = JSON.parse(deck);
      if (parsedDeck && typeof parsedDeck === 'object' && parsedDeck.hasOwnProperty('title') && parsedDeck.hasOwnProperty('cards')) {
        console.log('Found deck:', deck);
        setCurrentDeck(parsedDeck);
      } else {
        console.log('Found invalid deck:', deck);
        localStorage.removeItem('aiFlashCards.deck');
      }
    }
  }, []);

  const showFileLoader = async () => {
    setIsFileLoaderVisible(true);
  };

  const handleFileLoaded = (deck) => {
    setCurrentDeck(deck);
    localStorage.setItem('aiFlashCards.deck', JSON.stringify(deck));
    setIsFileLoaderVisible(false);
  };

  return (
    <div>
      <div className="w-full">
        {/* Header Container */}
        <div className="flex justify-between items-center bg-white px-4 py-2">
          
          {/* Title */}
          <div className="flex-grow-0">
            <h1 className="text-xl font-semibold">
              {currentDeck ? <div>{currentDeck.title}</div> : <div>Load a new deck</div>}
            </h1>
          </div>

          {/* Spacer */}
          <div className="flex-grow"></div>
          
          {/* Button */}
          <div className="flex-grow-0">
            <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={showFileLoader}>
              Load Deck
            </button>
            {/* TODO: use nicer overlay styling  */}
            {isFileLoaderVisible &&
              <div className="overlay">
                <FileLoader onFileLoaded={handleFileLoaded} />
              </div>
            }
          </div>
        </div>

        {/* Horizontal Line */}
        <hr className="border-t border-black" />
      </div>
      
      <div className="flex justify-center items-center min-w-1/2 rounded-lg bg-white shadow-lg p-4 m-4">
        <CardDeck currentDeck={currentDeck} />
      </div>
    </div>
  );
};

export default App;