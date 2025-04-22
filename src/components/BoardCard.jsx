function BoardCard({ card, handleCardClick }) {
  const matched = card.matched ? 'matched match-animation' : '';
  const flipped = card.flipped ? 'flipped' : '';

  return (
    <div className={`board-card ${matched} ${flipped}`} onClick={() => handleCardClick(card)}>
      <div
        className="board-card-front"
        style={{ backgroundImage: card.illusPathName ? `url(/illustrations/${card.illusPathName})` : null }}
      ></div>
      <div className="board-card-back"></div>
    </div>
  );
}

export default BoardCard;
