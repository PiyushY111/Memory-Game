import { useEffect, useState } from 'react';
import { calculateGameDuration } from '../utils';
import StatsCard from './StatsCard';

function Timer({ startedAt, endedAt }) {
  const [duration, setDuration] = useState('00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(calculateGameDuration(startedAt, endedAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, endedAt]);

  return <StatsCard label="Timer" value={duration} />;
}

export default Timer;
