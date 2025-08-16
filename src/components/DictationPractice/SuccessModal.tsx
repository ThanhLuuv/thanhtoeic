import React from 'react';
import { VocabularyItem } from '../../services';

interface SuccessModalProps {
  showModal: boolean;
  isCorrect: boolean;
  showNextButton: boolean;
  item: VocabularyItem;
  currentIndex: number;
  vocabListLength: number;
  setIdx: number;
  totalSets: number;
  isGeneratingExample: boolean;
  exampleError: string | null;
  exampleSentence: any;
  currentExamples: any[];
  currentExampleIndex: number;
  onGenerateExample: () => void;
  onNext: () => void;
  onNextExample: () => void;
  onPrevExample: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  showModal,
  isCorrect,
  showNextButton,
  item,
  currentIndex,
  vocabListLength,
  setIdx,
  totalSets,
  isGeneratingExample,
  exampleError,
  exampleSentence,
  currentExamples,
  currentExampleIndex,
  onGenerateExample,
  onNext,
  onNextExample,
  onPrevExample,
}) => {
  if (!showModal || !isCorrect || !showNextButton) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '600px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        animation: 'modalSlideIn 0.3s ease-out',
      }}>
        <h2 style={{
          color: '#14B24C',
          margin: '0 0 16px 0',
          fontSize: '24px',
          fontWeight: 'bold',
        }}>
          Correct!
        </h2>
        <div style={{
          background: '#f0fdf4',
          border: '2px solid #14B24C',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'red',
            marginBottom: '8px',
          }}>
            {item.meaning}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#059669',
            marginBottom: '12px',
            fontStyle: 'italic',
          }}>
            {item.phonetic}
          </div>
          <div style={{
            fontSize: '16px',
            color: '#374151',
            lineHeight: '1.5',
          }}>
            {item.word}
          </div>
        </div>

        {/* Example Generator Button */}
        <button
          onClick={onGenerateExample}
          disabled={isGeneratingExample}
          style={{
            background: isGeneratingExample ? '#9ca3af' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '6px 12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isGeneratingExample ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto 16px auto'
          }}
          onMouseEnter={(e) => {
            if (!isGeneratingExample) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isGeneratingExample) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            }
          }}
        >
          {isGeneratingExample ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Creating
            </>
          ) : (
            <>
              {currentExamples.length > 0 ? 'Create New Example' : 'Create Example'}
            </>
          )}
        </button>

        {/* Example Error */}
        {exampleError && (
          <div style={{
            color: '#dc2626',
            fontSize: '14px',
            marginBottom: '16px',
            padding: '8px 12px',
            background: '#fef2f2',
            borderRadius: '6px',
            border: '1px solid #fecaca'
          }}>
            {exampleError}
          </div>
        )}

        {/* Example Display */}
        {exampleSentence && (
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '2px solid #8b5cf6',
            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)'
          }}>
            {/* Example counter */}
            {currentExamples.length > 1 && (
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '8px',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                Câu mẫu {currentExampleIndex + 1}/{currentExamples.length}
              </div>
            )}
            
            <div style={{
              fontSize: '16px',
              color: '#1f2937',
              marginBottom: '8px',
              lineHeight: '1.5',
              fontWeight: '500'
            }}>
              {exampleSentence.englishSentence}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontStyle: 'italic',
              lineHeight: '1.4',
              marginBottom: '8px'
            }}>
              {exampleSentence.vietnameseTranslation}
            </div>
            {exampleSentence.contextInfo && (
              <div style={{
                fontSize: '12px',
                color: '#059669',
                padding: '8px 12px',
                background: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #d1fae5'
              }}>
                💡 {exampleSentence.contextInfo}
              </div>
            )}
            
            {/* Navigation buttons for multiple examples */}
            {currentExamples.length > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '12px'
              }}>
                <button
                  onClick={onPrevExample}
                  disabled={currentExampleIndex === 0}
                  style={{
                    background: currentExampleIndex === 0 ? '#e5e7eb' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: currentExampleIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentExampleIndex === 0 ? 0.5 : 1
                  }}
                >
                  ← Trước
                </button>
                <button
                  onClick={onNextExample}
                  disabled={currentExampleIndex === currentExamples.length - 1}
                  style={{
                    background: currentExampleIndex === currentExamples.length - 1 ? '#e5e7eb' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: currentExampleIndex === currentExamples.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: currentExampleIndex === currentExamples.length - 1 ? 0.5 : 1
                  }}
                >
                  Tiếp →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={onNext}
          style={{
            background: '#14B24C',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(20, 178, 76, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(20, 178, 76, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 178, 76, 0.3)';
          }}
        >
          {currentIndex === vocabListLength - 1 
            ? (setIdx < totalSets - 1 ? 'Next Set →' : 'Finish →')
            : 'Next Word →'
          }
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
