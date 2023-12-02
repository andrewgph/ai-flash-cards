import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import { sm2, next_card_id } from '../utils/sm2';


const CardDeck = (props) => {
  const [deck, setDeck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (props.currentDeck) {
      setDeck(props.currentDeck);

      const initialIndex = next_card_id(props.currentDeck.cards);
      console.log('Starting with card index:', initialIndex);
      setCurrentIndex(initialIndex);
    }
  }, [props.currentDeck]);

  const handleCardAnswer = (cardId, qualityOfAnswer) => {
    var grade = 0
    if (qualityOfAnswer === 'Again') {
      grade = 0
    } else if (qualityOfAnswer === 'Hard') {
      grade = 1
    } else if (qualityOfAnswer === 'Good') {
      grade = 3
    } else if (qualityOfAnswer === 'Easy') {
      grade = 5
    }

    const card = deck.cards.find(card => card.id === cardId);
    const { repetitions, interval, easeFactor } = sm2(card.repetitions, card.interval, card.easeFactor, grade);
    const lastReviewedDate = new Date().toISOString();

    // Update card with new repetitions, interval, and ease factor
    const updatedCard = { ...card, repetitions, interval, easeFactor, lastReviewedDate};
    console.log('Updated card:', updatedCard);
  
    const updatedDeckCards = deck.cards.map(card => card.id === cardId ? updatedCard : card);
    const updatedDeck = { ...deck, cards: updatedDeckCards };
    setDeck(updatedDeck);

    // Save to local storage
    localStorage.setItem('aiFlashCards.deck', JSON.stringify(updatedDeck));

    // Select a new card
    const newIndex = qualityOfAnswer !== 'Again' ? next_card_id(deck.cards) : currentIndex;
    console.log('Next card index:', newIndex);
    setCurrentIndex(newIndex);
  };

  const currentCard = deck ? deck.cards[currentIndex] : null;

  return currentCard ? (
      <Flashcard card={currentCard} onAnswer={handleCardAnswer} />
  ) : (
    <div>Loading deck...</div>
  );
};

export default CardDeck;