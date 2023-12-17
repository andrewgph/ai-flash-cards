function sm2(repetitions, interval, easeFactor, grade) {
    if (grade < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    }
  
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  
    return { repetitions, interval, easeFactor };
}

function filterAndRandomSelect(cards, filterFn, messageLengthFn) {
  let filteredCards = cards.filter(filterFn);
  console.log(messageLengthFn(filteredCards.length));
  if (filteredCards.length > 0) {
    return filteredCards[Math.floor(Math.random() * filteredCards.length)].id;
  }
  return null;
}

// TODO: allow setting of random seed for testing or mocking random selection
function next_card_id(cards) {
  // Check if any cards are due for review
  let cardId = filterAndRandomSelect(cards, card => {
    if (!card.lastReviewedDate) return false;
    const lastReviewedDate = new Date(card.lastReviewedDate);
    const now = new Date();
    const timeSinceLastReview = now.getTime() - lastReviewedDate.getTime();
    const daysSinceLastReview = timeSinceLastReview / (1000 * 3600 * 24);
    return daysSinceLastReview >= card.interval;
  }, (length) => `Found ${length} cards due for review`);
  if (cardId !== null) return cardId;

  // For any cards which have never been reviewed, select the next one by id order.
  // This assumes that the cards have an expected progression of the material.
  let neverReviewedCards = cards.filter(card => !card.lastReviewedDate);
  if (neverReviewedCards.length > 0) {
    console.log(`Found ${neverReviewedCards.length} cards that have never been reviewed. Selecting the next one by id order.`);
    return neverReviewedCards[0].id;
  }

  // Check if any cards have an repetitions of 0 (haven't been answered well yet)
  cardId = filterAndRandomSelect(cards, card => card.repetitions === 0,
    (length) => `Found ${length} cards with a repetitions of 0 (haven't been answered well yet)`);
  if (cardId !== null) return cardId;

  // Otherwise select a random card
  console.log('No cards to prioritize for review so selecting a random card.');
  return cards[Math.floor(Math.random() * cards.length)].id;
}

module.exports = {
  sm2,
  next_card_id
};