/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm Implementation
 * Based on Piotr Woźniak's SM-2 Algorithm specification with minimum EF floor of 1.3.
 */

export const SM2_MIN_EASE_FACTOR = 1.3;
export const SM2_DEFAULT_EASE_FACTOR = 2.5;

/**
 * Calculates the next SM-2 parameters after a review rating.
 *
 * @param {Object} params
 * @param {number} params.grade - Recall grade from 0 to 5
 *   0: Complete blackout
 *   1: Incorrect response; correct one remembered
 *   2: Incorrect response; correct one seemed easy to recall
 *   3: Correct response recalled with serious difficulty
 *   4: Correct response after hesitation
 *   5: Perfect response / immediate recall
 * @param {number} [params.repetitions=0] - Number of consecutive successful reviews (grade >= 3)
 * @param {number} [params.interval=1] - Current review interval in days
 * @param {number} [params.easeFactor=2.5] - Current Ease Factor (EF)
 * @param {string|Date} [params.currentDate] - Base date for scheduling (defaults to current UTC date)
 * @returns {Object} { repetitions, interval, easeFactor, nextReviewDate, isDueToday }
 */
export function calculateSM2({
  grade,
  repetitions = 0,
  interval = 1,
  easeFactor = SM2_DEFAULT_EASE_FACTOR,
  currentDate = new Date()
}) {
  // Ensure grade is clamped between 0 and 5
  const q = Math.max(0, Math.min(5, Math.round(Number(grade) || 0)));
  const prevEF = Math.max(SM2_MIN_EASE_FACTOR, Number(easeFactor) || SM2_DEFAULT_EASE_FACTOR);
  const prevInterval = Math.max(1, Number(interval) || 1);
  const prevReps = Math.max(0, Number(repetitions) || 0);

  // 1. Calculate new Ease Factor (EF)
  // Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  let newEF = Number((prevEF + delta).toFixed(2));
  if (newEF < SM2_MIN_EASE_FACTOR) {
    newEF = SM2_MIN_EASE_FACTOR;
  }

  // 2. Calculate new repetitions and interval
  let newReps = 0;
  let newInterval = 1;

  if (q >= 3) {
    // Successful recall
    if (prevReps === 0) {
      newInterval = 1;
    } else if (prevReps === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(prevInterval * newEF);
    }
    newReps = prevReps + 1;
  } else {
    // Failure (q < 3) - reset repetitions and schedule for 1 day
    newReps = 0;
    newInterval = 1;
  }

  // 3. Compute nextReviewDate in UTC YYYY-MM-DD
  const baseDate = typeof currentDate === 'string' ? new Date(currentDate) : new Date(currentDate);
  const nextDate = new Date(baseDate);
  nextDate.setUTCDate(nextDate.getUTCDate() + newInterval);
  const nextReviewDate = nextDate.toISOString().split('T')[0];

  return {
    grade: q,
    repetitions: newReps,
    interval: newInterval,
    easeFactor: newEF,
    nextReviewDate,
    previousValues: {
      repetitions: prevReps,
      interval: prevInterval,
      easeFactor: prevEF
    }
  };
}

/**
 * Returns formatted projected intervals for all grades 0-5
 * Useful for displaying live badge/hints on rating buttons in the UI!
 */
export function getProjectedIntervals({ repetitions = 0, interval = 1, easeFactor = 2.5 }) {
  const projections = {};
  for (let g = 0; g <= 5; g++) {
    const res = calculateSM2({ grade: g, repetitions, interval, easeFactor });
    projections[g] = {
      interval: res.interval,
      easeFactor: res.easeFactor,
      label: res.interval === 1 ? '1 day' : `${res.interval} days`
    };
  }
  return projections;
}

/**
 * Normalizes date to ISO YYYY-MM-DD string
 */
export function toISODateString(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * Checks if a card is due on or before target date
 */
export function isCardDue(cardNextReviewDate, targetDate = new Date()) {
  const todayStr = toISODateString(targetDate);
  if (!cardNextReviewDate) return true;
  return cardNextReviewDate <= todayStr;
}
