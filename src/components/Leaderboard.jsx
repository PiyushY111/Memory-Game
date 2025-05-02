import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import './Leaderboard.css';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        const scoresRef = collection(db, 'scores');
        let q;
        
        if (selectedLevel === 'all') {
          q = query(scoresRef, orderBy('score', 'desc'));
        } else {
          q = query(
            scoresRef,
            where('level', '==', selectedLevel),
            orderBy('score', 'desc')
          );
        }
        
        const querySnapshot = await getDocs(q);
        
        // Create a Map to store unique scores by userId and level
        const uniqueScores = new Map();
        
        querySnapshot.docs.forEach(doc => {
          const scoreData = {
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
          };
          
          // Create a unique key combining userId and level
          const key = `${scoreData.userId}_${scoreData.level}`;
          
          // Only keep the highest score for each user in each level
          if (!uniqueScores.has(key) || uniqueScores.get(key).score < scoreData.score) {
            uniqueScores.set(key, scoreData);
          }
        });
        
        // Convert Map to array and sort by score
        const scoresList = Array.from(uniqueScores.values())
          .sort((a, b) => b.score - a.score);
        
        setScores(scoresList);
      } catch (error) {
        console.error('Error fetching scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [selectedLevel]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">Leaderboard</h1>
        <p className="leaderboard-subtitle">Track your progress and compete with others</p>
      </div>
      
      <div className="level-filter">
        <button 
          className={`filter-btn ${selectedLevel === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedLevel('all')}
        >
          <span className="filter-icon">🏆</span>
          All Levels
        </button>
        <button 
          className={`filter-btn ${selectedLevel === '4x4' ? 'active' : ''}`}
          onClick={() => setSelectedLevel('4x4')}
        >
          <span className="filter-icon">🎯</span>
          4x4
        </button>
        <button 
          className={`filter-btn ${selectedLevel === '6x6' ? 'active' : ''}`}
          onClick={() => setSelectedLevel('6x6')}
        >
          <span className="filter-icon">🎯</span>
          6x6
        </button>
        <button 
          className={`filter-btn ${selectedLevel === '8x8' ? 'active' : ''}`}
          onClick={() => setSelectedLevel('8x8')}
        >
          <span className="filter-icon">🎯</span>
          8x8
        </button>
      </div>

      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
              <th>Level</th>
              <th>Moves</th>
              <th>Misses</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-scores">
                  No scores available for this level yet. Be the first to play!
                </td>
              </tr>
            ) : (
              scores.map((score, index) => (
                <tr key={score.id} className={currentUser?.uid === score.userId ? 'current-user' : ''}>
                  <td>
                    <div className="rank-container">
                      {index < 3 ? (
                        <img
                          src={`/ranking-icons/${index + 1}-place.svg`}
                          width={24}
                          height={24}
                          alt={`${index + 1} place icon`}
                          className="rank-icon"
                        />
                      ) : null}
                      <span className="rank-number">#{index + 1}</span>
                    </div>
                  </td>
                  <td>
                    <div className="player-info">
                      <span className="player-name">{score.username}</span>
                      {currentUser?.uid === score.userId && (
                        <span className="current-player-badge">You</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="score-cell">
                      <span className="score-value">{score.score}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="level-badge">{score.level}</span>
                  </td>
                  <td>{score.moves}</td>
                  <td>{score.misses}</td>
                  <td className="date-cell">{formatDate(score.timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 