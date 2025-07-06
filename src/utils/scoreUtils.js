import api from '../services/api';

export const saveScore = async (userId, username, score, level, moves, misses) => {
  try {
    await api.saveScore(score, level, moves, misses);
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
}; 