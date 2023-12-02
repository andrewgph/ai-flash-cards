import React, { useState } from 'react';
import Papa from 'papaparse';

const FileLoader = ({ onFileLoaded }) => {
  const [deck] = useState(null);

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
        onFileLoaded(deck);
      }
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {/* Display the deck data */}
      {deck && <pre>{JSON.stringify(deck, null, 2)}</pre>}
    </div>
  );
};

export default FileLoader;