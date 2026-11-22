import { calculateSM2, getProjectedIntervals, SM2_MIN_EASE_FACTOR } from '../lib/sm2.js';

console.log('--- Testing SM-2 Implementation ---');

// Test 1: Brand new card (reps=0, interval=1, EF=2.5), grade 5 (perfect)
const t1 = calculateSM2({ grade: 5, repetitions: 0, interval: 1, easeFactor: 2.5, currentDate: '2026-11-20' });
console.assert(t1.repetitions === 1, `Expected reps=1, got ${t1.repetitions}`);
console.assert(t1.interval === 1, `Expected interval=1 for first repetition, got ${t1.interval}`);
console.assert(t1.easeFactor === 2.6, `Expected EF=2.6, got ${t1.easeFactor}`);
console.log('✓ Test 1 Passed: Brand new card with Grade 5');

// Test 2: Card with repetitions=1, interval=1, EF=2.5, grade 5 (THE DEMO CASE!)
// Prompt: "flips card 1 ('What is the time complexity of QuickSort?'), rates it '5 - Perfect', and the SM-2 engine calculates its next review in 6 days."
const t2 = calculateSM2({ grade: 5, repetitions: 1, interval: 1, easeFactor: 2.5, currentDate: '2026-11-20' });
console.assert(t2.repetitions === 2, `Expected reps=2, got ${t2.repetitions}`);
console.assert(t2.interval === 6, `Expected interval=6 for second repetition, got ${t2.interval}`);
console.assert(t2.easeFactor === 2.6, `Expected EF=2.6, got ${t2.easeFactor}`);
console.assert(t2.nextReviewDate === '2026-11-26', `Expected nextReviewDate=2026-11-26, got ${t2.nextReviewDate}`);
console.log('✓ Test 2 Passed: Demo case (reps=1 -> rating 5 -> 6 days next review)');

// Test 3: Card with repetitions=2, interval=6, EF=2.6, grade 4
// EF' = 2.6 + (0.1 - (5-4) * (0.08 + (5-4)*0.02)) = 2.6 + 0.1 - 0.10 = 2.60
// interval = round(6 * 2.60) = round(15.6) = 16 days
const t3 = calculateSM2({ grade: 4, repetitions: 2, interval: 6, easeFactor: 2.6, currentDate: '2026-11-20' });
console.assert(t3.repetitions === 3, `Expected reps=3, got ${t3.repetitions}`);
console.assert(t3.interval === 16, `Expected interval=16, got ${t3.interval}`);
console.assert(t3.easeFactor === 2.6, `Expected EF=2.6, got ${t3.easeFactor}`);
console.log('✓ Test 3 Passed: Third repetition with Grade 4');

// Test 4: Failure case (grade < 3) - should reset repetitions to 0 and interval to 1
const t4 = calculateSM2({ grade: 1, repetitions: 4, interval: 45, easeFactor: 2.6, currentDate: '2026-11-20' });
console.assert(t4.repetitions === 0, `Expected reps=0 on failure, got ${t4.repetitions}`);
console.assert(t4.interval === 1, `Expected interval=1 on failure, got ${t4.interval}`);
console.assert(t4.easeFactor < 2.6, `Expected EF to decrease on failure, got ${t4.easeFactor}`);
console.log('✓ Test 4 Passed: Failure resets interval to 1');

// Test 5: Minimum floor for Ease Factor is 1.3
let lowEF = 1.35;
for (let i = 0; i < 5; i++) {
  const res = calculateSM2({ grade: 0, repetitions: 0, interval: 1, easeFactor: lowEF });
  lowEF = res.easeFactor;
}
console.assert(lowEF === SM2_MIN_EASE_FACTOR, `Expected EF to floor at 1.3, got ${lowEF}`);
console.log('✓ Test 5 Passed: Minimum floor 1.3 enforced');

// Test 6: Projections preview
const projections = getProjectedIntervals({ repetitions: 1, interval: 1, easeFactor: 2.5 });
console.assert(projections[5].interval === 6, `Projection for 5 should be 6d`);
console.assert(projections[0].interval === 1, `Projection for 0 should be 1d`);
console.log('✓ Test 6 Passed: Projections generated correctly');

console.log('ALL SM-2 UNIT TESTS PASSED SUCCESSFULLY! 🎉');
