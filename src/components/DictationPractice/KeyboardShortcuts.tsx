import React from 'react';

const KeyboardShortcuts: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '16px',
      fontSize: '11px',
      color: '#888',
      fontFamily: 'monospace'
    }}>
      <span style={{
        background: '#f8f9fa',
        padding: '2px 6px',
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      }}>
        <kbd style={{ background: '#fff', border: '1px solid #ccc', borderRadius: '3px', padding: '1px 4px', fontSize: '10px' }}>Enter</kbd> Check/Next
      </span>
      <span style={{
        background: '#f8f9fa',
        padding: '2px 6px',
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      }}>
        <kbd style={{ background: '#fff', border: '1px solid #ccc', borderRadius: '3px', padding: '1px 4px', fontSize: '10px' }}>Shift</kbd> Audio
      </span>
      <span style={{
        background: '#f8f9fa',
        padding: '2px 6px',
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      }}>
        <kbd style={{ background: '#fff', border: '1px solid #ccc', borderRadius: '3px', padding: '1px 4px', fontSize: '10px' }}>Ctrl</kbd> Show Answer
      </span>
    </div>
  );
};

export default KeyboardShortcuts;
