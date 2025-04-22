import { useEffect, useState } from 'react';
import { calculateAccuracy, calculateGameDuration } from '../utils';
import Button from './Button';
import StatsCard from './StatsCard';

function Win({ handleGameRestart, handleLevelChange, stats }) {
  const [topResults, setTopResults] = useState([]);

  useEffect(() => {
    let topRes = [];
    const storageRes = localStorage.getItem(`results-${stats.selectedLevel.grid}`);

    if (storageRes) {
      const parsedStorageRes = JSON.parse(storageRes);
      const alreadyExists = parsedStorageRes.find(game => game.endedAt === stats.endedAt);
      !alreadyExists && parsedStorageRes.push(stats);

      const sortedRes = parsedStorageRes.sort((res1, res2) => (res1.misses > res2.misses ? 1 : -1));

      topRes = sortedRes.length > 3 ? sortedRes.slice(0, 3) : sortedRes;
    } else {
      topRes = [stats];
    }

    localStorage.setItem(`results-${stats.selectedLevel.grid}`, JSON.stringify(topRes));
    setTopResults(topRes);
  }, [stats]);

  return (
    <div className="win-container">
      <div className="win-container-header">
        <img src="/graphics/level-win.gif" className="celebration-gif" width={150} height={150} alt="Celebration gif" />
        <div className="text-center">
          <img src="/graphics/trophy.svg" className="trophy-icon" width={60} height={60} alt="Trophy icon" />
          <div>You win!</div>
          <div className="d-flex gap-10 align-items-center justify-content-center">
            <StatsCard label="Moves" value={stats.moves} />
            <StatsCard label="Time" value={calculateGameDuration(stats.startedAt, stats.endedAt)} />
          </div>
        </div>
        <img src="/graphics/level-win.gif" className="celebration-gif" width={150} height={150} alt="Celebration gif" />
      </div>
      <div className="win-container-table">
        <div className="text-center">Your ranking for board size: {stats.selectedLevel.grid}</div>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Moves</th>
              <th>Misses</th>
              <th>Accuracy</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {topResults.length
              ? topResults.map((row, index) => (
                  <tr key={row.startedAt}>
                    <td>
                      <div className="d-flex gap-10 align-items-center justify-content-center">
                        <img
                          src={`/ranking-icons/${index + 1}-place.svg`}
                          width={18}
                          height={18}
                          alt={`${index + 1} place icon`}
                        />
                      </div>
                    </td>
                    <td>{row.moves}</td>
                    <td>{row.misses}</td>
                    <td>{calculateAccuracy(row.matchedCards, row.moves)}%</td>
                    <td>{calculateGameDuration(row.startedAt, row.endedAt)}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>

        <div className="d-flex gap-10 align-items-center justify-content-center mt-2">
          <Button className="primary-btn" onClick={handleGameRestart} name="Retry" />
          <Button className="primary-btn" onClick={handleLevelChange} name="Change level" />
        </div>
      </div>
    </div>
  );
}

export default Win;
