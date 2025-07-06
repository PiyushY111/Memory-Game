import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { RefreshCw } from 'lucide-react';
import './Leaderboard.css';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const { currentUser } = useAuth();

  const fetchScores = async () => {
    try {
      setLoading(true);
      const scoresData = await api.getLeaderboard(selectedLevel, 50);
      setScores(scoresData);
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [selectedLevel]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchScores();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loading, selectedLevel]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchScores();
  };

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
        <div className="header-content">
          <div>
            <h1 className="leaderboard-title">Leaderboard</h1>
            <p className="leaderboard-subtitle">Track your progress and compete with others</p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="refresh-button"
            title="Refresh leaderboard"
          >
            <RefreshCw className={`refresh-icon ${refreshing ? 'spinning' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
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
                <tr key={score._id} className={currentUser?.id === score.userId?._id ? 'current-user' : ''}>
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
                      <span className="player-name">{score.displayName}</span>
                      {currentUser?.id === score.userId?._id && (
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