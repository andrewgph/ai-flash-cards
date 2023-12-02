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

function next_card_id(cards) {
  // Check if any cards are due for review
  let dueReviewCards = cards.filter(card => {
    if (!card.lastReviewedDate) return false;
    const lastReviewedDate = new Date(card.lastReviewedDate);
    const now = new Date();
    const timeSinceLastReview = now.getTime() - lastReviewedDate.getTime();
    const daysSinceLastReview = timeSinceLastReview / (1000 * 3600 * 24);
    return daysSinceLastReview >= card.interval;
  });
  if (dueReviewCards.length > 0) {
    console.log(`Found ${dueReviewCards.length} cards due for review.`);
    return dueReviewCards[Math.floor(Math.random() * dueReviewCards.length)].id;
  } else {
    console.log('No cards due for review.');
  }

  // Check if any cards have never been reviewed
  let neverReviewedCards = cards.filter(card => !card.lastReviewedDate);
  if (neverReviewedCards.length > 0) {
    console.log(`Found ${neverReviewedCards.length} never reviewed cards.`);
    return neverReviewedCards[Math.floor(Math.random() * neverReviewedCards.length)].id;
  } else {
    console.log('All cards have been reviewed at least once.');
  }

  // Check if any cards have an repetitions of 0 (haven't been answereed well yet)
  let zeroRepetitionsCards = cards.filter(card => card.repetitions === 0);
  if (zeroRepetitionsCards.length > 0) {
    console.log(`Found ${zeroRepetitionsCards.length} cards with repetitions of 0.`);
    return zeroRepetitionsCards[Math.floor(Math.random() * zeroRepetitionsCards.length)].id;
  } else {
    console.log('No cards with repetitions of 0.');
  }

  // Otherwise select a random card
  console.log('No cards to prioritize for review so selecting a random card.');
  return cards[Math.floor(Math.random() * cards.length)].id;
}

module.exports = {
  sm2,
  next_card_id
};