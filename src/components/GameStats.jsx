import { calculateAccuracy } from '../utils';
import StatsCard from './StatsCard';
import Timer from './Timer';

function GameStats({ stats }) {
  return (
    <div className="game-stats">
      <Timer label="Time" startedAt={stats.startedAt} endedAt={stats.endedAt} />
      <StatsCard label="Moves" value={stats.moves} />
      <StatsCard label="Misses" value={stats.misses} />
      <StatsCard label="Accuracy" value={`${calculateAccuracy(stats.matchedCards, stats.moves)}%`} />
    </div>
  );
}

export default GameStats;
