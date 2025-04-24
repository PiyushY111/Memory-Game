import { useState, useRef } from 'react';
import { gameLevels } from '../utils/constants';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

function Levels({ handleLevelClick }) {
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="levels-container">
      <h2 className="levels-heading">Choose Your Challenge</h2>
      
      {/* Desktop scroll controls - only visible on desktop */}
      <div className="level-scroll-controls">
        <button className="scroll-button scroll-left" onClick={scrollLeft} aria-label="Scroll left">
          <ChevronLeft />
        </button>
        <button className="scroll-button scroll-right" onClick={scrollRight} aria-label="Scroll right">
          <ChevronRight />
        </button>
      </div>
      
      {/* Horizontally scrollable container on desktop */}
      <div className="level-cards-outer-container">
        <div className="level-cards-container" ref={scrollContainerRef}>
          {gameLevels.map((level, index) => (
            <div 
              key={level.grid} 
              className={`level-card ${hoveredLevel === index ? 'level-card-active' : ''}`}
              onClick={() => handleLevelClick(level)}
              onMouseEnter={() => setHoveredLevel(index)}
              onMouseLeave={() => setHoveredLevel(null)}
            >
              <div className="level-card-content">
                <div className="level-card-header">
                  <h3 className="level-card-title">{level.title}</h3>
                  <span className="level-card-indicator">
                    <ArrowRight className="level-card-arrow" />
                  </span>
                </div>
                
                <div className="level-card-image-container">
                  <img 
                    src={level.icon} 
                    className="level-card-icon" 
                    alt={level.title} 
                    loading="lazy"
                  />
                </div>
                
                <p className="level-card-subtitle">{level.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Levels;