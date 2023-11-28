import React, { useState } from 'react';
import Papa from 'papaparse';

const FileLoader = ({ onFileLoaded }) => {
  const [deck, setDeck] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const deck = {
          title: file.name, 
          cards: results.data.map(row => ({ front: row.front, back: row.back })),
        };
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