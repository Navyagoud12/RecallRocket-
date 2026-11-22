import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from './data/store.js';
import { calculateSM2, getProjectedIntervals, toISODateString } from './lib/sm2.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------------------------
// DECK ROUTES
// -------------------------------------------------------------
app.get('/api/decks', (req, res) => {
  try {
    const decks = store.getDecks();
    res.json({ success: true, decks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/decks/:id', (req, res) => {
  try {
    const deck = store.getDeck(req.params.id);
    if (!deck) return res.status(404).json({ success: false, error: 'Deck not found' });
    res.json({ success: true, deck });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/decks', (req, res) => {
  try {
    const { name, description, category, icon, color } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Deck name is required' });
    }
    const deck = store.createDeck({ name, description, category, icon, color });
    res.status(201).json({ success: true, deck });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/decks/:id', (req, res) => {
  try {
    const ok = store.deleteDeck(req.params.id);
    if (!ok) return res.status(404).json({ success: false, error: 'Deck not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// CARD ROUTES
// -------------------------------------------------------------
app.get('/api/cards/due', (req, res) => {
  try {
    const { deckId } = req.query;
    const cards = store.getDueCards(deckId || null);
    res.json({ success: true, count: cards.length, cards });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/decks/:id/cards', (req, res) => {
  try {
    const { question, answer, tags } = req.body;
    if (!question || !question.trim() || !answer || !answer.trim()) {
      return res.status(400).json({ success: false, error: 'Question and answer are required' });
    }
    const card = store.addCard(req.params.id, { question, answer, tags });
    res.status(201).json({ success: true, card });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/cards/:id', (req, res) => {
  try {
    const card = store.updateCard(req.params.id, req.body);
    if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
    res.json({ success: true, card });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/cards/:id', (req, res) => {
  try {
    const ok = store.deleteCard(req.params.id);
    if (!ok) return res.status(404).json({ success: false, error: 'Card not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// SM-2 REVIEW & PROJECTIONS ROUTE
// -------------------------------------------------------------
app.post('/api/cards/:id/review', (req, res) => {
  try {
    const { grade, clientDate } = req.body;
    if (grade === undefined || grade === null) {
      return res.status(400).json({ success: false, error: 'Recall grade (0-5) is required' });
    }
    const result = store.processReview(req.params.id, grade, clientDate ? new Date(clientDate) : new Date());
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/cards/:id/projections', (req, res) => {
  try {
    const card = store.data.cards.find(c => c.id === req.params.id);
    if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
    const projections = getProjectedIntervals({
      repetitions: card.repetitions,
      interval: card.interval,
      easeFactor: card.easeFactor
    });
    res.json({ success: true, projections });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// USER & LEADERBOARD ROUTES
// -------------------------------------------------------------
app.get('/api/user', (req, res) => {
  try {
    const user = store.getUser();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = store.getLeaderboard();
    res.json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// AI FLASHCARD GENERATOR (5 Q&A pairs from text)
// -------------------------------------------------------------
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { text, targetDeckId } = req.body;
    if (!text || text.trim().length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least a couple of sentences of lecture material or notes.'
      });
    }

    // Heuristic & NLP generator that extracts key concepts, definitions, and questions
    const generatedCards = generateFlashcardsFromText(text);

    res.json({
      success: true,
      cards: generatedCards,
      count: generatedCards.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper for intelligent flashcard extraction
function generateFlashcardsFromText(rawText) {
  const clean = rawText.replace(/\r/g, '').trim();
  const sentences = clean.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 15);
  const cards = [];

  // Look for patterns like "X is defined as Y", "X refers to Y", "X has complexity Y", bullet lists, etc.
  const definitionRegex = /([A-Za-z0-9\s\-]+?)\s+(is defined as|refers to|is a|means|is the process of|consists of|represents)\s+([^.]+)/i;
  const complexityRegex = /(time complexity|space complexity|order of magnitude|asymptotic bound)\s*(?:of|for)?\s*([A-Za-z0-9\s]+?)\s*(?:is|=|:)\s*([^.]+)/i;
  const vsRegex = /difference between\s+([A-Za-z0-9\s]+?)\s+and\s+([A-Za-z0-9\s]+?)\s+is\s+([^.]+)/i;

  const foundKeys = new Set();

  for (const sentence of sentences) {
    if (cards.length >= 5) break;

    // Pattern 1: Definitions
    const defMatch = sentence.match(definitionRegex);
    if (defMatch && defMatch[1].trim().length < 50 && !foundKeys.has(defMatch[1].toLowerCase().trim())) {
      const term = defMatch[1].trim();
      const verb = defMatch[2].trim();
      const rest = defMatch[3].trim();
      foundKeys.add(term.toLowerCase());
      cards.push({
        question: `What is ${term}?`,
        answer: `• **Definition:** ${term} ${verb} ${rest}.\n• **Key Takeaway:** Foundational concept in lecture notes.`,
        tags: ['AI Generated', term.split(' ')[0]]
      });
      continue;
    }

    // Pattern 2: Complexity
    const compMatch = sentence.match(complexityRegex);
    if (compMatch && !foundKeys.has(compMatch[2].toLowerCase().trim())) {
      const metric = compMatch[1].trim();
      const algorithm = compMatch[2].trim();
      const bound = compMatch[3].trim();
      foundKeys.add(algorithm.toLowerCase());
      cards.push({
        question: `What is the ${metric} of ${algorithm}?`,
        answer: `• **Answer:** The ${metric} is **${bound}**.\n• **Context:** As noted in the lecture excerpt.`,
        tags: ['AI Generated', 'Complexity']
      });
      continue;
    }

    // Pattern 3: Comparisons
    const vsMatch = sentence.match(vsRegex);
    if (vsMatch && !foundKeys.has(vsMatch[1].toLowerCase().trim())) {
      const termA = vsMatch[1].trim();
      const termB = vsMatch[2].trim();
      const explanation = vsMatch[3].trim();
      foundKeys.add(termA.toLowerCase());
      cards.push({
        question: `What is the key difference between ${termA} and ${termB}?`,
        answer: `• **Distinction:** ${explanation}.\n• **Comparative Analysis:** Contrast between ${termA} and ${termB}.`,
        tags: ['AI Generated', 'Comparison']
      });
      continue;
    }
  }

  // Fallback: If heuristic patterns yielded fewer than 5, partition sentences into analytical Q&A pairs
  let idx = 0;
  while (cards.length < 5 && idx < sentences.length) {
    const s = sentences[idx].trim();
    idx++;
    if (s.length < 25) continue;

    // Extract subject/topic phrase
    const words = s.split(/\s+/);
    const subject = words.slice(0, Math.min(4, words.length)).join(' ');

    // Avoid duplicate cards
    if (cards.some(c => c.question.includes(subject))) continue;

    cards.push({
      question: `Explain the significance of: "${subject}..."?`,
      answer: `• **Explanation:** ${s}\n• **Lecture Concept:** Crucial technical concept for exam revision.`,
      tags: ['AI Generated', 'Core Concept']
    });
  }

  // If still fewer than 5 cards (e.g. text was short), synthesize comprehensive cards
  while (cards.length < 5) {
    const n = cards.length + 1;
    cards.push({
      question: `Summary Point #${n}: What key principle was discussed in this passage?`,
      answer: `• **Core Principle:** ${sentences[n % sentences.length] || clean.substring(0, 100) + '...'}\n• **Recall Anchor:** Review this concept to ensure complete retention.`,
      tags: ['AI Generated', 'Summary']
    });
  }

  return cards.slice(0, 5);
}

// -------------------------------------------------------------
// EXPORT / IMPORT
// -------------------------------------------------------------
app.get('/api/export/:deckId', (req, res) => {
  try {
    const deck = store.getDeck(req.params.id || req.params.deckId);
    if (!deck) return res.status(404).json({ success: false, error: 'Deck not found' });
    const format = req.query.format || 'json';

    if (format === 'csv') {
      let csv = 'Question,Answer,Tags,Interval,Repetitions,EaseFactor\n';
      deck.cards.forEach(c => {
        const q = `"${c.question.replace(/"/g, '""')}"`;
        const a = `"${c.answer.replace(/"/g, '""')}"`;
        const t = `"${(c.tags || []).join(';').replace(/"/g, '""')}"`;
        csv += `${q},${a},${t},${c.interval || 1},${c.repetitions || 0},${c.easeFactor || 2.5}\n`;
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${deck.name.replace(/[^a-z0-9]/gi, '_')}.csv"`);
      return res.send(csv);
    }

    res.setHeader('Content-Disposition', `attachment; filename="${deck.name.replace(/[^a-z0-9]/gi, '_')}.json"`);
    res.json({
      deck: {
        name: deck.name,
        description: deck.description,
        category: deck.category
      },
      cards: deck.cards
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/import', (req, res) => {
  try {
    const { name, description, category, cards, csvText } = req.body;

    let parsedCards = cards || [];
    if (csvText && csvText.trim()) {
      parsedCards = parseCsvToCards(csvText);
    }

    if (!parsedCards || parsedCards.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid cards found in import payload' });
    }

    const result = store.importDeck({
      name: name || 'Imported Deck',
      description,
      category,
      cards: parsedCards
    });

    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

function parseCsvToCards(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  // Parse header
  const cards = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parser handling quotes
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"' && (c === 0 || line[c - 1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

    if (parts.length >= 2 && parts[0] && parts[1]) {
      cards.push({
        question: parts[0],
        answer: parts[1],
        tags: parts[2] ? parts[2].split(';').map(t => t.trim()) : ['Imported']
      });
    }
  }
  return cards;
}

// -------------------------------------------------------------
// RESET TO PRISTINE DEMO STATE
// -------------------------------------------------------------
app.post('/api/demo/reset', (req, res) => {
  try {
    store.reset();
    res.json({
      success: true,
      message: 'Database reset to pristine demo scenario state!',
      deck: store.getDeck('deck_algorithms')
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Single Page App fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 RecallRocket server is running on http://localhost:${PORT}`);
});

export default app;
