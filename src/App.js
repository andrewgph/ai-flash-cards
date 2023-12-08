import './tailwind.css';
import React, { useState } from 'react';
import OpenAIClient from './utils/OpenAIClient';
import CardDeck from './components/CardDeck';
import useDeck from './hooks/useDeck.js';
import DeckLoader from './components/DeckLoader';

const App = () => {
  const { currentDeck, loadDeck } = useDeck();
  const [isOpenAIKeyInputVisible, setIsOpenAIKeyInputVisible] = useState(false);
  const [openAIClient, setOpenAIClient] = useState(null); 

  const showOpenAIAPIKeyInput = async () => {
    if (openAIClient) {
      setOpenAIClient(null);
    } else {
      setIsOpenAIKeyInputVisible(true);
    }
  };

  const handleOpenAIAPIKeyInput = (textInput) => {
    const client = new OpenAIClient(textInput);
    setOpenAIClient(client);
    setIsOpenAIKeyInputVisible(false);
  };

  const saveDeckToFile = () => {
    const dataStr = JSON.stringify(currentDeck);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
    const filename = window.prompt("Enter filename", "deck.json");
  
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
  }

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
          
          {/* Buttons */}
          <div className="flex-grow-0 mr-4"> {/* Add right margin to the first button container */}
            <button 
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" 
              title="Set and Unset OpenAI Key to toggle AI features"
              onClick={showOpenAIAPIKeyInput}
            >
              {openAIClient ? 'Unset OpenAI Key' : 'Set OpenAI Key'}
            </button>
            {/* TODO: use nicer overlay styling  */}
            {isOpenAIKeyInputVisible &&
              <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white bg-opacity-50 p-4 rounded flex flex-col items-end">
                  <input 
                    type="text" 
                    className="input w-64" 
                    placeholder="Enter OpenAI Key" 
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleOpenAIAPIKeyInput(event.target.value);
                      }
                    }} 
                  />
                  <div className="mt-4"></div> {/* Added margin-top for spacing */}
                  <button 
                    onClick={() => setIsOpenAIKeyInputVisible(false)} 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            }
          </div>
          <div className="flex-grow-0"> {/* No right margin for the third button container */}
            <DeckLoader onLoad={loadDeck} />
          </div>
          <div className="flex-grow-0"> {/* Add right margin to the second button container */}
            <button 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4" 
                title="Save current deck to a file"
                onClick={saveDeckToFile}
              >
                Save Deck
            </button>
          </div>
        </div>

        {/* Horizontal Line */}
        <hr className="border-t border-black" />
      </div>
      
      <div className="flex justify-center items-center min-w-1/2 rounded-lg bg-white shadow-lg p-4 m-4">
        <CardDeck currentDeck={currentDeck} openAIClient={openAIClient} />
      </div>
    </div>
  );
};

export default App;