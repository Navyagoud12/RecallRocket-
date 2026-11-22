import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateSM2, toISODateString } from '../lib/sm2.js';
import { getSeedData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

class Store {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.reset();
      }
    } catch (err) {
      console.warn('Error reading database file, re-initializing seed data:', err.message);
      this.reset();
    }
  }

  reset() {
    this.data = getSeedData();
    this.save();
    return this.data;
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing database file:', err.message);
    }
  }

  getDecks() {
    const todayStr = toISODateString();
    return this.data.decks.map(deck => {
      const deckCards = this.data.cards.filter(c => c.deckId === deck.id);
      const dueCards = deckCards.filter(c => !c.nextReviewDate || c.nextReviewDate <= todayStr);
      const masteredCards = deckCards.filter(c => c.interval >= 14);
      const learningCards = deckCards.filter(c => c.interval < 14 && c.reviewCount > 0);
      const newCards = deckCards.filter(c => c.reviewCount === 0);

      return {
        ...deck,
        totalCards: deckCards.length,
        dueCount: dueCards.length,
        masteredCount: masteredCards.length,
        learningCount: learningCards.length,
        newCount: newCards.length
      };
    });
  }

  getDeck(id) {
    const deck = this.data.decks.find(d => d.id === id);
    if (!deck) return null;
    const cards = this.getCards(id);
    const todayStr = toISODateString();
    const dueCount = cards.filter(c => !c.nextReviewDate || c.nextReviewDate <= todayStr).length;

    return {
      ...deck,
      totalCards: cards.length,
      dueCount,
      cards
    };
  }

  createDeck({ name, description, category = 'General', icon = '📚', color = '#4f46e5' }) {
    const id = 'deck_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newDeck = {
      id,
      name: name.trim(),
      description: description ? description.trim() : '',
      category: category.trim(),
      icon,
      color,
      createdAt: toISODateString()
    };
    this.data.decks.unshift(newDeck);
    this.save();
    return this.getDeck(id);
  }

  deleteDeck(id) {
    const index = this.data.decks.findIndex(d => d.id === id);
    if (index === -1) return false;
    this.data.decks.splice(index, 1);
    this.data.cards = this.data.cards.filter(c => c.deckId !== id);
    this.save();
    return true;
  }

  getCards(deckId = null) {
    const todayStr = toISODateString();
    const list = deckId
      ? this.data.cards.filter(c => c.deckId === deckId)
      : this.data.cards;

    return list.map(c => ({
      ...c,
      isDue: !c.nextReviewDate || c.nextReviewDate <= todayStr
    }));
  }

  getDueCards(deckId = null) {
    const todayStr = toISODateString();
    let cards = this.data.cards.filter(c => !c.nextReviewDate || c.nextReviewDate <= todayStr);
    if (deckId) {
      cards = cards.filter(c => c.deckId === deckId);
    }
    return cards.map(c => ({
      ...c,
      isDue: true
    }));
  }

  addCard(deckId, cardData) {
    const deck = this.data.decks.find(d => d.id === deckId);
    if (!deck) throw new Error('Deck not found');

    const id = 'card_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const todayStr = toISODateString();

    const newCard = {
      id,
      deckId,
      question: cardData.question.trim(),
      answer: cardData.answer.trim(),
      tags: Array.isArray(cardData.tags)
        ? cardData.tags
        : (cardData.tags ? cardData.tags.split(',').map(t => t.trim()).filter(Boolean) : [deck.name]),
      repetitions: 0,
      interval: 1,
      easeFactor: 2.50,
      nextReviewDate: todayStr,
      lastReviewedDate: null,
      reviewCount: 0,
      history: []
    };

    this.data.cards.push(newCard);
    this.save();
    return newCard;
  }

  updateCard(cardId, updates) {
    const card = this.data.cards.find(c => c.id === cardId);
    if (!card) return null;

    if (updates.question !== undefined) card.question = updates.question.trim();
    if (updates.answer !== undefined) card.answer = updates.answer.trim();
    if (updates.tags !== undefined) {
      card.tags = Array.isArray(updates.tags)
        ? updates.tags
        : updates.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (updates.easeFactor !== undefined) card.easeFactor = Number(updates.easeFactor);
    if (updates.interval !== undefined) card.interval = Number(updates.interval);
    if (updates.repetitions !== undefined) card.repetitions = Number(updates.repetitions);
    if (updates.nextReviewDate !== undefined) card.nextReviewDate = updates.nextReviewDate;

    this.save();
    return card;
  }

  deleteCard(cardId) {
    const idx = this.data.cards.findIndex(c => c.id === cardId);
    if (idx === -1) return false;
    this.data.cards.splice(idx, 1);
    this.save();
    return true;
  }

  getUser() {
    return this.data.user;
  }

  getLeaderboard() {
    // Sort leaderboard descending by retentionPoints
    const sorted = [...this.data.leaderboard].sort((a, b) => b.retentionPoints - a.retentionPoints);
    return sorted.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  }

  /**
   * Core review logic with SM-2, streak tracking, point calculation, and leaderboard rank update
   */
  processReview(cardId, grade, clientDate = new Date()) {
    const card = this.data.cards.find(c => c.id === cardId);
    if (!card) throw new Error(`Card ${cardId} not found`);

    const q = Math.max(0, Math.min(5, Math.round(Number(grade) || 0)));
    const todayStr = toISODateString(clientDate);

    // Compute previous user rank on leaderboard before this review
    const prevLeaderboard = this.getLeaderboard();
    const prevUserEntry = prevLeaderboard.find(e => e.id === this.data.user.id);
    const prevRank = prevUserEntry ? prevUserEntry.rank : 3;

    // 1. Calculate SM-2 scheduling
    const sm2Result = calculateSM2({
      grade: q,
      repetitions: card.repetitions,
      interval: card.interval,
      easeFactor: card.easeFactor,
      currentDate: clientDate
    });

    // Update card SM-2 state
    card.repetitions = sm2Result.repetitions;
    card.interval = sm2Result.interval;
    card.easeFactor = sm2Result.easeFactor;
    card.nextReviewDate = sm2Result.nextReviewDate;
    card.lastReviewedDate = todayStr;
    card.reviewCount = (card.reviewCount || 0) + 1;

    // Append to review history
    if (!card.history) card.history = [];
    card.history.push({
      date: todayStr,
      grade: q,
      interval: sm2Result.interval,
      easeFactor: sm2Result.easeFactor,
      repetitions: sm2Result.repetitions
    });

    // 2. Update Streak
    const user = this.data.user;
    const yesterday = new Date(clientDate);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = toISODateString(yesterday);

    let streakChanged = false;
    let newBadgeUnlocked = null;

    if (user.lastStudyDate !== todayStr) {
      if (user.lastStudyDate === yesterdayStr) {
        // Maintained consecutive streak!
        user.streak += 1;
        streakChanged = true;
      } else {
        // Streak was broken or new start
        user.streak = 1;
        streakChanged = true;
      }
      user.lastStudyDate = todayStr;
    }

    // Check streak milestone badges
    if (user.streak >= 7 && !user.badges.some(b => b.id === 'seven_day_streak')) {
      newBadgeUnlocked = {
        id: 'seven_day_streak',
        name: '7-Day Consistent Scholar',
        icon: '🔥',
        description: 'Completed 7 consecutive days of SM-2 active recall reviews!',
        unlockedAt: todayStr
      };
      user.badges.push(newBadgeUnlocked);
    }

    // 3. Retention Points calculation
    // Base 15 points + 5 points per grade score (q=5 gives 40 points)
    // Bonus for streak
    const pointsGained = 15 + (q * 5) + (user.streak >= 7 ? 20 : 5);
    user.retentionPoints += pointsGained;
    user.totalReviews += 1;

    // 4. Update user in Leaderboard
    const lbEntry = this.data.leaderboard.find(e => e.id === user.id);
    if (lbEntry) {
      lbEntry.retentionPoints = user.retentionPoints;
      lbEntry.totalReviews = user.totalReviews;
      lbEntry.streak = user.streak;
      if (user.streak >= 7) {
        lbEntry.badge = '🔥 7-Day Master';
      }
    }

    // 5. Check Rank Jump!
    const newLeaderboard = this.getLeaderboard();
    const newUserEntry = newLeaderboard.find(e => e.id === user.id);
    const newRank = newUserEntry ? newUserEntry.rank : prevRank;

    let rankJump = null;
    if (newRank < prevRank) {
      const passedUser = prevLeaderboard.find(e => e.rank === newRank);
      rankJump = {
        previousRank: prevRank,
        newRank,
        passedName: passedUser ? passedUser.name : 'cohort peer'
      };
    }

    this.save();

    return {
      card,
      sm2: sm2Result,
      user: {
        streak: user.streak,
        retentionPoints: user.retentionPoints,
        totalReviews: user.totalReviews,
        badges: user.badges
      },
      pointsGained,
      streakChanged,
      newBadgeUnlocked,
      rankJump,
      leaderboard: newLeaderboard
    };
  }

  /**
   * Import deck from CSV or JSON
   */
  importDeck({ name, description, category, cards }) {
    const deck = this.createDeck({
      name: name || 'Imported Deck',
      description: description || 'Imported via CSV/JSON',
      category: category || 'Imported'
    });

    const createdCards = [];
    for (const cardItem of cards) {
      if (!cardItem.question || !cardItem.answer) continue;
      const card = this.addCard(deck.id, {
        question: cardItem.question,
        answer: cardItem.answer,
        tags: cardItem.tags || [deck.name]
      });
      createdCards.push(card);
    }

    return { deck, cardsCount: createdCards.length };
  }
}

export const store = new Store();
