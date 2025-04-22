import { gameLevels } from '../utils/constants';

function Levels({ handleLevelClick }) {
  return (
    <div className="level-cards-container">
      {gameLevels.map(level => (
        <div key={level.grid} className="level-card" onClick={() => handleLevelClick(level)}>
          <div className="level-card-title">{level.title}</div>
          <img src={level.icon} className="level-card-icon" width={160} height={160} alt={level.title} />
          <div className="level-card-subtitle">{level.subtitle}</div>
        </div>
      ))}
    </div>
  );
}

export default Levels;
