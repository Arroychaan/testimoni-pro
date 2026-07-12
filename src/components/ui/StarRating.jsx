import { useState } from 'react';
import { Star } from '@phosphor-icons/react';
import './StarRating.css';

export default function StarRating({
  value = 0,
  onChange,
  size = 24,
  interactive = false,
  showValue = false,
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    if (interactive && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="star-rating" role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${value} dari 5`}>
      <div className="star-rating-stars">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoverValue || value);
          return (
            <button
              key={star}
              type="button"
              className={`star-rating-btn ${isFilled ? 'star-filled' : 'star-empty'} ${interactive ? 'star-interactive' : ''}`}
              onClick={() => handleClick(star)}
              onMouseEnter={() => interactive && setHoverValue(star)}
              onMouseLeave={() => interactive && setHoverValue(0)}
              disabled={!interactive}
              aria-label={`${star} bintang`}
              tabIndex={interactive ? 0 : -1}
            >
              <Star
                size={size}
                weight={isFilled ? 'fill' : 'regular'}
                color={isFilled ? '#fbbf24' : 'var(--color-text-muted)'}
              />
            </button>
          );
        })}
      </div>
      {showValue && value > 0 && (
        <span className="star-rating-value">{Number(value).toFixed(1)}</span>
      )}
    </div>
  );
}
