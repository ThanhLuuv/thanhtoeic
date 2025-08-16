import React from 'react';
import './ActionButtons.css';

interface ActionButtonsProps {
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onSubmit, 
  disabled = false, 
  loading = false 
}) => {
  return (
    <div className="action-buttons-inline">
      <button 
        className="btn btn-primary" 
        onClick={onSubmit}
        disabled={disabled || loading}
      >
        {loading ? 'Đang chuyển câu...' : 'Xác nhận đáp án'}
      </button>
    </div>
  );
};

export default ActionButtons;
