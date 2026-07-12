import './Card.css';

export default function Card({ children, className = '', hover = true, onClick, ...props }) {
  const classNames = ['card', hover && 'card-hover', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} onClick={onClick} {...props}>
      {children}
    </div>
  );
}
