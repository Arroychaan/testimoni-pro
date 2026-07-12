import { MessageSquare } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({
  icon: Icon = MessageSquare,
  title = 'Belum ada data',
  description = '',
  action,
}) {
  return (
    <div className="empty-state animate-fade-in-up">
      <div className="empty-state-icon-wrapper">
        <Icon size={40} strokeWidth={1.2} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
