import BoardCard from './BoardCard';

function GameBoard({ cards, handleCardClick, grid }) {
  return (
    <div className="game-main">
      <div className={`cards-grid grid-${grid}`}>
        {cards.map(card => (
          <BoardCard key={card.id} card={card} handleCardClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
