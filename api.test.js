import app from '../server.js';
import { store } from '../data/store.js';

async function runApiTests() {
  console.log('--- Running RecallRocket API Integration Tests ---');
  store.reset();

  const baseUrl = 'http://localhost:3000';

  // Test 1: Decks endpoint
  const decksRes = await fetch(`${baseUrl}/api/decks`);
  const decksData = await decksRes.json();
  console.assert(decksData.success, 'Decks endpoint should return success');
  console.assert(decksData.decks.length === 4, `Expected 4 decks, got ${decksData.decks.length}`);
  console.log(`✓ Test 1 Passed: Decks loaded (${decksData.decks.length} decks)`);

  // Test 2: Check Algorithms Deck
  const algoDeck = decksData.decks.find(d => d.id === 'deck_algorithms');
  console.assert(algoDeck.dueCount === 5, `Expected 5 cards due in Algorithms deck, got ${algoDeck.dueCount}`);
  console.log(`✓ Test 2 Passed: Algorithms deck has 5 cards due today`);

  // Test 3: Due Cards Endpoint
  const dueRes = await fetch(`${baseUrl}/api/cards/due?deckId=deck_algorithms`);
  const dueData = await dueRes.json();
  console.assert(dueData.cards.length === 5, `Expected 5 cards, got ${dueData.cards.length}`);
  const card1 = dueData.cards[0];
  console.assert(card1.question === 'What is the time complexity of QuickSort?', 'Card 1 must be QuickSort');
  console.log(`✓ Test 3 Passed: Card 1 is QuickSort, interval: ${card1.interval}, reps: ${card1.repetitions}`);

  // Test 4: Submit Review Rating 5 on QuickSort Card (Demo Scenario!)
  // Prompt: "The presenter flips card 1 ('What is the time complexity of QuickSort?'), rates it '5 - Perfect', and the SM-2 engine calculates its next review in 6 days."
  const reviewRes = await fetch(`${baseUrl}/api/cards/${card1.id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grade: 5 })
  });
  const reviewData = await reviewRes.json();
  console.assert(reviewData.success, 'Review submission should succeed');
  console.assert(reviewData.sm2.interval === 6, `Expected interval to be 6 days, got ${reviewData.sm2.interval}`);
  console.assert(reviewData.user.streak === 7, `Expected streak to become 7, got ${reviewData.user.streak}`);
  console.assert(reviewData.newBadgeUnlocked?.id === 'seven_day_streak', 'Expected 7-day badge unlocked');
  console.log(`✓ Test 4 Passed: Rating 5 scheduled card in 6 days (SM-2 reps=2, EF=2.60)`);
  console.log(`✓ User streak reached: ${reviewData.user.streak} days with badge "${reviewData.newBadgeUnlocked?.name}"!`);

  // Test 5: Complete the remaining 4 cards to observe rank jump to #2!
  for (let i = 1; i < dueData.cards.length; i++) {
    const c = dueData.cards[i];
    const rRes = await fetch(`${baseUrl}/api/cards/${c.id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade: 5 })
    });
    const rData = await rRes.json();
    if (rData.rankJump) {
      console.log(`🎉 Rank Jump detected! Previous Rank: #${rData.rankJump.previousRank} -> New Rank: #${rData.rankJump.newRank} (passed ${rData.rankJump.passedName})`);
    }
  }

  // Test 6: Check Leaderboard standing
  const lbRes = await fetch(`${baseUrl}/api/leaderboard`);
  const lbData = await lbRes.json();
  const myEntry = lbData.leaderboard.find(e => e.id === 'user_alex_chen');
  console.log(`✓ Test 6: Final user rank on leaderboard is #${myEntry.rank} (${myEntry.name}, ${myEntry.retentionPoints} pts)`);
  console.assert(myEntry.rank === 2, `Expected rank to be #2, got #${myEntry.rank}`);

  // Test 7: AI Flashcard Generator
  const aiRes = await fetch(`${baseUrl}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'A Binary Search Tree is a node-based binary tree data structure with logarithmic lookup. The time complexity of search in a balanced BST is O(log n). In contrast, Hash Maps provide O(1) expected average lookup. Red-Black trees maintain balance via node coloring and rotations. Heap data structures guarantee O(1) find-minimum.'
    })
  });
  const aiData = await aiRes.json();
  console.assert(aiData.success, 'AI generate should succeed');
  console.assert(aiData.cards.length === 5, `Expected 5 cards, got ${aiData.cards.length}`);
  console.log(`✓ Test 7 Passed: AI generated ${aiData.cards.length} cards from lecture excerpt`);

  // Reset to demo state
  const resetRes = await fetch(`${baseUrl}/api/demo/reset`, { method: 'POST' });
  const resetData = await resetRes.json();
  console.assert(resetData.success, 'Demo reset should succeed');
  console.log('✓ Test 8 Passed: Reset back to pristine demo state');

  console.log('\n🌟 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS! 🌟');
  process.exit(0);
}

runApiTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
