import React from 'react';

interface CompletionButtonsProps {
  currentIndex: number;
  totalItems: number;
  isCorrect: boolean;
  setIndex: number;
  completedSets: Set<number>;
  onNavigateHome: () => void;
  onNavigateNextSet: () => void;
  hasNextSet: boolean;
  setType: 'part1' | 'part2' | 'vocab';
}

const CompletionButtons: React.FC<CompletionButtonsProps> = ({
  currentIndex,
  totalItems,
  isCorrect,
  setIndex,
  completedSets,
  onNavigateHome,
  onNavigateNextSet,
  hasNextSet,
  setType
}) => {
  const isSetCompleted = isCorrect && currentIndex === totalItems - 1;

  if (!isSetCompleted) return null;

  return (
    <div style={{ textAlign: 'center', marginTop: 28 }}>
      {!completedSets.has(setIndex) && (
        <div style={{ 
          background: setType === 'vocab' ? '#4caf50' : '#1976d2', 
          color: 'white', 
          padding: '12px 20px', 
          borderRadius: 8, 
          marginBottom: 16,
          fontWeight: 'bold',
          fontSize: 16
        }}>
          🎉 Chúc mừng! Bạn đã hoàn thành Set {setIndex + 1}
        </div>
      )}
      
      <button
        onClick={onNavigateHome}
        style={{
          background: '#1976d2', 
          color: 'white', 
          border: 'none', 
          borderRadius: 8, 
          padding: '10px 32px', 
          fontWeight: 700, 
          fontSize: 16, 
          cursor: 'pointer', 
          boxShadow: '0 2px 8px #e0e0e0', 
          marginTop: 8
        }}
      >
        ← Back to List
      </button>
      
      {/* Next Set Button */}
      {hasNextSet && (
        <button
          onClick={onNavigateNextSet}
          style={{
            background: '#43a047', 
            color: 'white', 
            border: 'none', 
            borderRadius: 8, 
            padding: '10px 32px', 
            fontWeight: 700, 
            fontSize: 16, 
            cursor: 'pointer', 
            boxShadow: '0 2px 8px #e0e0e0', 
            marginTop: 16, 
            marginLeft: 12
          }}
        >
          Next Set →
        </button>
      )}
    </div>
  );
};

export default CompletionButtons;
