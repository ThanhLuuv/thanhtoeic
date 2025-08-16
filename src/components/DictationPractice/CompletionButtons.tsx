import React from 'react';

interface CompletionButtonsProps {
  currentIndex: number;
  vocabListLength: number;
  isCorrect: boolean;
  setIdx: number;
  totalSets: number;
  completedSentences: number;
  onNavigateHome: () => void;
  onNavigateNextSet: () => void;
}

const CompletionButtons: React.FC<CompletionButtonsProps> = ({
  currentIndex,
  vocabListLength,
  isCorrect,
  setIdx,
  totalSets,
  completedSentences,
  onNavigateHome,
  onNavigateNextSet,
}) => {
  if (currentIndex !== vocabListLength - 1 || !isCorrect) return null;

  return (
    <div style={{ textAlign: 'center', marginTop: 28 }}>
      <div style={{ 
        background: '#14B24C', 
        color: 'white', 
        padding: '12px 20px', 
        borderRadius: 8, 
        marginBottom: 16,
        fontWeight: 'bold',
        fontSize: 16
      }}>
        🎉 Congratulations! You have finished Set {setIdx + 1}
        <br />
        <small>Total sentences completed: {completedSentences}</small>
      </div>
      <button
        onClick={onNavigateHome}
        style={{
          background: '#14B24C', 
          color: 'white', 
          border: 'none', 
          borderRadius: 8, 
          padding: '10px 32px', 
          fontWeight: 700, 
          fontSize: 16, 
          cursor: 'pointer', 
          boxShadow: '0 2px 8px #e0e0e0', 
          marginTop: 8, 
          marginRight: 12
        }}
      >
        ← Back to List
      </button>
      {setIdx < totalSets - 1 && (
        <button
          onClick={onNavigateNextSet}
          style={{
            background: '#0284c7', 
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
          Next Set →
        </button>
      )}
    </div>
  );
};

export default CompletionButtons;
