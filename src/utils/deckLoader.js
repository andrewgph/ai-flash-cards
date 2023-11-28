export const loadDeck = async () => {
    const deck = {
      title: 'Demo Deck',
      cards: [
        { front: 'Question 1', back: 'Answer 1' },
        { front: 'Question 2', back: 'Answer 2' },
        { front: 'Question 3', back: 'Answer 3' },
        // Add more cards as needed
      ],
    };
    return deck;
  };