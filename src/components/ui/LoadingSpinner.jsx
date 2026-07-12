import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 40, text = 'Memuat...' }) {
  return (
    <div className="loading-spinner" role="status">
      <svg
        className="loading-spinner-svg"
        width={size}
        height={size}
        viewBox="0 0 50 50"
      >
        <circle
          className="loading-spinner-track"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
        />
        <circle
          className="loading-spinner-circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {text && <span className="loading-spinner-text">{text}</span>}
    </div>
  );
}
