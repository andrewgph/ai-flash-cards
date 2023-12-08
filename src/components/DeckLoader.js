import React, { useState } from 'react';
import Papa from 'papaparse';

const DeckLoader = ({ onLoad }) => {
  const [deck] = useState(null);
  const [isFileLoaderVisible, setIsFileLoaderVisible] = useState(false);

  const showFileLoader = () => {
    setIsFileLoaderVisible(true);
  };

  const handleFileLoaded = (deck) => {
    onLoad(deck);
    setIsFileLoaderVisible(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const deck = {
          title: file.name, 
          cards: results.data.map((row, index) => ({
            id: index, 
            front: row.front, 
            back: row.back,
            repetitions: row.repetitions ? row.repetitions : 0,
            interval: row.interval ? row.interval : 0,
            easeFactor: row.easeFactor ? row.easeFactor : 2.5,
            lastReviewedDate: row.lastReviewedDate ? row.lastReviewedDate : null
          })),
        };
        console.log('Parsed deck:', deck);
        handleFileLoaded(deck);
      }
    });
  };

  return (
    <div>
      <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={showFileLoader}>Load Deck</button>
      {isFileLoaderVisible && 
      <div className="overlay">
        <input type="file" onChange={handleFileChange} />
      </div>}
    </div>
  );
};

export default DeckLoader;