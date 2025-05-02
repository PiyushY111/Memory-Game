import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const saveScore = async (userId, username, score, level, moves, misses) => {
  try {
    const scoresRef = collection(db, 'scores');
    await addDoc(scoresRef, {
      userId,
      username,
      score,
      level,
      moves,
      misses,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
}; 