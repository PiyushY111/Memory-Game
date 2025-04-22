import { useEffect, useState } from 'react';
import Layout from './layout';
import GameStats from './components/GameStats';
import GameBoard from './components/GameBoard';
import GameFooter from './components/GameFooter';
import Levels from './components/Levels';
import Win from './components/Win';
import { setUpCards } from './utils';
import './App.css';

function App() {
  // ----------------------------- STATE -----------------------------
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const [moves, setMoves] = useState(0);
  const [misses, setMisses] = useState(0);
  const [matchedCards, setMatchedCards] = useState(0);

  const [playSuccessSound, setPlaySuccessSound] = useState(false);

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  // ----------------------------- GENERAL FUNCTIONS -----------------------------
  const initializeGame = () => {
    const initCards = setUpCards(selectedLevel.pair);
    setCards(initCards);

    setStartedAt(new Date().toISOString());
  };

  const resetStats = () => {
    setMoves(0);
    setMisses(0);
    setMatchedCards(0);
    setStartedAt(null);
    setEndedAt(null);
  };

  const handleLevelChange = () => {
    let confirmed = true;
    if (!endedAt && moves > 0) {
      confirmed = window.confirm('Game in progress, are you sure you want to leave?');
    }

    if (confirmed) {
      resetStats();
      setSelectedLevel(null);
    }
  };

  const handleGameRestart = () => {
    let confirmed = true;
    if (!endedAt && moves > 0) {
      confirmed = window.confirm('Are you sure you want to restart the game?');
    }
    if (confirmed) {
      resetStats();
      initializeGame();
    }
  };

  // ----------------------------- GAME HANDLER FUNCTIONS -----------------------------

  // Step 1 (Flip cards on click)
  const handleCardClick = card => {
    if (card.flipped || card.matched) return;

    setCards(prev =>
      prev.map(c => (c.id === card.id ? { ...card, flipped: true, flippedCount: c.flippedCount + 1 } : c)),
    );
    setFlippedCards(prev => [...prev, card]);
  };

  // Step 2 (Close previously opened cards when the third card is clicked, if they are still open)
  const closeAdditionalCards = () => {
    // Clear timeout for closing cards after 1 second to avoid additional flip
    clearTimeout(timeoutId);

    const lastOpenCard = flippedCards[flippedCards.length - 1];

    setFlippedCards([lastOpenCard]);
    setCards(cards.map(c => (c.id !== lastOpenCard.id ? { ...c, flipped: c.matched ? c.flipped : false } : c)));
  };

  // Step 3 (Check if opened cards are matching and update stats)
  const checkForMatch = () => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      // Increment moves
      setMoves(prev => prev + 1);

      if (card1.illusPathName === card2.illusPathName) {
        setCards(prev => prev.map(c => (c.id === card1.id || c.id === card2.id ? { ...c, matched: true } : c)));

        // Increment matched cards number
        setMatchedCards(prev => prev + 1);

        // Play matching cards sound
        setPlaySuccessSound(true);
      } else {
        if (card1.flippedCount > 0 && card2.flippedCount > 0) {
          // Increment misses
          setMisses(prev => prev + 1);
        }

        // Flip cards back after 1 second
        const timeId = setTimeout(() => {
          flipBack();
        }, 1000);

        // Save timeout ID for using in closeAdditionalCards() function
        setTimeoutId(timeId);
      }
    }
  };

  // Step 4 (Flip back not matching cards)
  const flipBack = () => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;

      setCards(prev => prev.map(c => (c.id === card1.id || c.id === card2.id ? { ...c, flipped: false } : c)));
      setFlippedCards([]);
    }
  };

  // ------------- USE EFFECTS ---------------
  useEffect(() => {
    if (selectedLevel) {
      initializeGame();
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (flippedCards.length > 2) {
      closeAdditionalCards();
    } else if (flippedCards.length === 2) {
      checkForMatch();
    }
  }, [flippedCards]);

  useEffect(() => {
    if (cards.length) {
      const unmatchedCards = cards.filter(c => !c.matched);
      if (!unmatchedCards.length) {
        setTimeout(() => {
          setEndedAt(new Date().toISOString());
          new Audio('/audio/level-win.mp3').play();
        }, 1000);
      }
    }
  }, [cards]);

  useEffect(() => {
    if (playSuccessSound) {
      new Audio('/audio/success-sound.mp3').play();
      setPlaySuccessSound(false);
    }
  }, [playSuccessSound]);

  return (
    <Layout>
      {endedAt ? (
        <Win
          handleGameRestart={handleGameRestart}
          handleLevelChange={handleLevelChange}
          stats={{ selectedLevel, moves, misses, matchedCards, startedAt, endedAt }}
        />
      ) : startedAt ? (
        <div className="game-grid">
          <GameStats stats={{ selectedLevel, moves, misses, matchedCards, startedAt, endedAt }} />
          <GameBoard cards={cards} handleCardClick={handleCardClick} grid={selectedLevel.grid} />
          <GameFooter handleLevelChange={handleLevelChange} handleGameRestart={handleGameRestart} />
        </div>
      ) : (
        <Levels handleLevelClick={l => setSelectedLevel(l)} />
      )}
    </Layout>
  );
}

export default App;
