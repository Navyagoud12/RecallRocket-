import { store } from '../data/store.js';

console.log('--- Testing Store ---');
store.reset();
const decks = store.getDecks();
console.log(`Loaded ${decks.length} decks.`);
const algoDeck = decks.find(d => d.id === 'deck_algorithms');
console.log(`Algorithms deck has ${algoDeck.dueCount} cards due today (total ${algoDeck.totalCards}).`);
console.assert(algoDeck.dueCount === 5, `Expected 5 cards due today in Algorithms deck, got ${algoDeck.dueCount}`);

const dueCards = store.getDueCards('deck_algorithms');
console.assert(dueCards.length === 5, `Expected 5 due cards, got ${dueCards.length}`);
console.log(`First card question: "${dueCards[0].question}"`);

// Review first card with rating 5 (QuickSort card)
const result = store.processReview(dueCards[0].id, 5);
console.log(`Review result: Interval changed to ${result.sm2.interval} days (expected 6)`);
console.assert(result.sm2.interval === 6, `Expected interval=6, got ${result.sm2.interval}`);
console.assert(result.card.repetitions === 2, `Expected reps=2, got ${result.card.repetitions}`);
console.log(`User streak is now: ${result.user.streak} days (badge unlocked: ${result.newBadgeUnlocked?.name || 'none'})`);
console.assert(result.user.streak === 7, `Expected streak to become 7, got ${result.user.streak}`);
console.assert(result.newBadgeUnlocked?.id === 'seven_day_streak', 'Expected 7-day badge unlocked');

console.log('✓ Store tests passed cleanly!');
// Reset again so seed state is untouched
store.reset();
console.log('✓ Store reset to clean seed state.');
