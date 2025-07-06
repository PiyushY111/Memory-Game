import express from 'express';
import { body, validationResult } from 'express-validator';
import Score from '../models/Score.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @desc    Save a new score
// @route   POST /api/scores
// @access  Private
router.post('/', protect, [
  body('score').isNumeric().withMessage('Score must be a number'),
  body('level').notEmpty().withMessage('Level is required'),
  body('moves').isNumeric().withMessage('Moves must be a number'),
  body('misses').isNumeric().withMessage('Misses must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { score, level, moves, misses } = req.body;

    const newScore = await Score.create({
      userId: req.user._id,
      displayName: req.user.displayName,
      score,
      level,
      moves,
      misses
    });

    res.status(201).json({
      success: true,
      message: 'Score saved successfully',
      data: newScore
    });
  } catch (error) {
    console.error('Save score error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving score'
    });
  }
});

// @desc    Get leaderboard scores
// @route   GET /api/scores/leaderboard
// @access  Public (with optional auth)
router.get('/leaderboard', optionalAuth, async (req, res) => {
  try {
    const { level = 'all', limit = 50 } = req.query;
    
    let query = {};
    if (level !== 'all') {
      query.level = level;
    }

    const scores = await Score.find(query)
      .sort({ score: -1, timestamp: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'displayName email');

    // Get unique scores per user per level (best score only)
    const uniqueScores = new Map();
    scores.forEach(score => {
      const key = `${score.userId._id}_${score.level}`;
      if (!uniqueScores.has(key) || uniqueScores.get(key).score < score.score) {
        uniqueScores.set(key, score);
      }
    });

    const leaderboard = Array.from(uniqueScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard'
    });
  }
});

// @desc    Get user's scores
// @route   GET /api/scores/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(20);

    res.json({
      success: true,
      data: scores
    });
  } catch (error) {
    console.error('Get user scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user scores'
    });
  }
});

// @desc    Get user's best scores by level
// @route   GET /api/scores/user/best
// @access  Private
router.get('/user/best', protect, async (req, res) => {
  try {
    const bestScores = await Score.aggregate([
      { $match: { userId: req.user._id } },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: '$level',
          bestScore: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$bestScore' } },
      { $sort: { level: 1 } }
    ]);

    res.json({
      success: true,
      data: bestScores
    });
  } catch (error) {
    console.error('Get user best scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user best scores'
    });
  }
});

export default router; 