const { sm2, next_card_id } = require('./sm2');

describe('sm2', () => {
  it('should return correct values for grade less than 3', () => {
    const result = sm2(2, 1, 2.5, 2);
    expect(result).toEqual({ repetitions: 0, interval: 1, easeFactor: 2.18 });
  });

  it('should return correct values for grade greater than or equal to 3', () => {
    expect(sm2(0, 1, 2.5, 4)).toEqual({ repetitions: 1, interval: 1, easeFactor: 2.5 });
    expect(sm2(1, 1, 2.5, 5)).toEqual({ repetitions: 2, interval: 6, easeFactor: 2.6 });
    expect(sm2(2, 6, 2.6, 5)).toEqual({ repetitions: 3, interval: 16, easeFactor: 2.7 });
  });
});

describe('next_card_id', () => {
  it('should return the id of the card due for review', () => {
    const cards = [
      { id: 1, lastReviewedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), interval: 5 },
      { id: 2, lastReviewedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), interval: 5 },
    ];
    const result = next_card_id(cards);
    expect(result).toBe(1);
  });

  it('should return the id of the card that has never been reviewed', () => {
    const cards = [
      { id: 1, lastReviewedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), interval: 5 },
      { id: 2 },
    ];
    const result = next_card_id(cards);
    expect(result).toBe(2);
  });

  it('should return the id of the card that has repetitions of 0', () => {
    const cards = [
      { id: 1, lastReviewedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), interval: 5, repetitions: 1 },
      { id: 2, lastReviewedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), interval: 5, repetitions: 0 },
    ];
    const result = next_card_id(cards);
    expect(result).toBe(2);
  });

  // Add more tests as needed
});