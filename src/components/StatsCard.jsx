function StatsCard({ label, value }) {
  return (
    <div className="stats-card">
      <div className="stats-card-label">{label}:</div>
      <div className="stats-card-value">{value}</div>
    </div>
  );
}

export default StatsCard;
