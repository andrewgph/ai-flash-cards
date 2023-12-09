import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import { sm2, next_card_id } from '../utils/sm2';
import useDeck from '../hooks/useDeck';

const CardDeck = (props) => {
  const [deck, setDeck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openAIClient, setOpenAIClient] = useState(null); 
  const { saveDeck } = useDeck();

  useEffect(() => {
    if (props.currentDeck) {
      setDeck(props.currentDeck);

      const initialIndex = next_card_id(props.currentDeck.cards);
      console.log('Starting with card index:', initialIndex);
      setCurrentIndex(initialIndex);
    }
  }, [props.currentDeck]);

  useEffect(() => {
    setOpenAIClient(props.openAIClient)
    if (props.openAIClient) {
      console.log('Setting openAIClient in CardDeck');
    } else {
      console.log('Unsetting openAIClient in CardDeck');
    }
  }, [props.openAIClient]);

  useEffect(() => {
    if (deck && deck.cards[currentIndex]) {
      playCardAudio(deck.cards[currentIndex]);
    }
  }, [currentIndex]);
  
  const playCardAudio = (card) => {
    if (openAIClient) {
      openAIClient.textToSpeech(card.front).then(audioBlob => {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }).catch(error => {
        console.error('Error transcribing audio:', error);
      });
    } else {
      console.log('No OpenAI client - so not generating speech to read card');
    }
  }

  const handleTextAnswer = (cardId, textInput) => {
    console.log('textInput:', textInput);

    const card = deck.cards.find(card => card.id === cardId);

    if (!openAIClient) {
      console.log('No OpenAI client');
      return;
    }

    // Get answer from OpenAI
    openAIClient.gradeAnswer(card, textInput).then(summary => {
        console.log('Using AI grade:', summary);
        handleCardGrade(cardId, summary, null)
    }).catch(error => {
        console.error('Unable to get AI grade:', error);
    });
  }

  const handleCardAnswer = (cardId, qualityOfAnswer) => {
    let grade = 0; // Changed from var to let
    if (qualityOfAnswer === 'Again') {
      grade = 0;
    } else if (qualityOfAnswer === 'Hard') {
      grade = 1;
    } else if (qualityOfAnswer === 'Good') {
      grade = 3;
    } else if (qualityOfAnswer === 'Easy') {
      grade = 5;
    }
    handleCardGrade(cardId, grade, qualityOfAnswer);
  };

  const updateCard = (card, grade) => {
    const { repetitions, interval, easeFactor } = sm2(card.repetitions, card.interval, card.easeFactor, grade);
    const lastReviewedDate = new Date().toISOString();

    // Update card with new repetitions, interval, and ease factor
    return { ...card, repetitions, interval, easeFactor, lastReviewedDate};
  }

  const handleCardGrade = (cardId, grade, qualityOfAnswer) => {
    const card = deck.cards.find(card => card.id === cardId);
    const updatedCard = updateCard(card, grade);
    console.log('Updated card:', updatedCard);

    const updatedDeckCards = deck.cards.map(card => card.id === cardId ? updatedCard : card);
    const updatedDeck = { ...deck, cards: updatedDeckCards };
    setDeck(updatedDeck);

    // Save to local storage
    saveDeck(updatedDeck);

    // Select a new card
    let newIndex = currentIndex;
    if (qualityOfAnswer === 'Again') {
      console.log('Again selected so repeating card with index:', currentIndex);
    } else {
      newIndex = next_card_id(updatedDeck.cards);
      console.log('Next card index:', newIndex);
    }
    setCurrentIndex(newIndex);

    // TODO: manually triggering the playCardAudio function as the useEffect wont trigger if the currentIndex is the same
    if (newIndex === currentIndex) {
      playCardAudio(deck.cards[newIndex]);
    }
  };

  const currentCard = deck ? deck.cards[currentIndex] : null;

  return currentCard ? (
      <Flashcard card={currentCard} onAnswer={handleCardAnswer} onTextAnswer={handleTextAnswer} openAIClient={openAIClient} />
  ) : (
    <div>Loading deck...</div>
  );
};

export default CardDeck;