import React, { useRef } from 'react';
import { VocabularyItem } from '../../services';
import { SoundToggle, ProgressBar, AudioButton, ActionButtons, AnswerDisplay} from '../common';
import KeyboardShortcuts from './KeyboardShortcuts';

interface MainPracticeCardProps {
  item: VocabularyItem;
  currentIndex: number;
  vocabListLength: number;
  progress: number;
  soundEnabled: boolean;
  userInputs: string[];
  result: (boolean | null)[];
  showAnswer: boolean;
  showNextButton: boolean;
  isChecked: boolean;
  isCorrect: boolean;
  topic: string;
  setIdx: number;
  completedSentences: number;
  actionButtons: any[];
  answerItems: any[];
  onSoundToggle: () => void;
  onInputChange: (value: string) => void;
  onPlayAudio: (audio?: string, word?: string) => void;
  onToggleAnswer: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const MainPracticeCard: React.FC<MainPracticeCardProps> = ({
  item,
  currentIndex,
  vocabListLength,
  progress,
  soundEnabled,
  userInputs,
  result,
  showAnswer,
  showNextButton,
  isChecked,
  isCorrect,
  topic,
  setIdx,
  completedSentences,
  actionButtons,
  answerItems,
  onSoundToggle,
  onInputChange,
  onPlayAudio,
  onToggleAnswer,
  onKeyDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{
      maxWidth: 400,
      width: '100%',
      margin: '0 auto',
      padding: 24,
      border: '1px solid #e0e0e0',
      borderRadius: 16,
      background: '#fff',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      fontFamily: 'inherit',
      position: 'relative',
    }}>
      <SoundToggle 
        soundEnabled={soundEnabled}
        onToggle={onSoundToggle}
      />

      <ProgressBar progress={progress} />

      <div style={{ textAlign: 'center', color: '#888', fontSize: 15, marginBottom: 18 }}>
        Topic: <b>{topic}</b>
        <span style={{ 
          marginLeft: 8, 
          background: '#14B24C', 
          color: 'white', 
          padding: '2px 8px', 
          borderRadius: 12, 
          fontSize: 12,
          fontWeight: 'bold'
        }}>
          ✓ {completedSentences} completed
        </span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 12, color: '#555', fontSize: 15 }}>
        <span style={{ background: '#f5f5f5', borderRadius: 8, padding: '2px 12px' }}>
          Word {currentIndex + 1} / {vocabListLength}
        </span>
      </div>

      {/* Main Input Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '16px', 
        marginBottom: '28px' 
      }}>
        <AudioButton 
          onClick={() => onPlayAudio(item.audio, item.word)}
          title="Play word"
        />

        <input
          ref={inputRef}
          type="text"
          value={userInputs[currentIndex] || ''}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          readOnly={isCorrect}
          style={{
            width: '200px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: isChecked 
              ? (isCorrect ? '2px solid #059669' : '2px solid #dc2626') 
              : '2px solid #cbd5e1',
            textAlign: 'center',
            background: isChecked 
              ? (isCorrect ? '#f0fdf4' : '#fef2f2') 
              : '#ffffff',
            color: isChecked 
              ? (isCorrect ? '#059669' : '#dc2626') 
              : '#1e293b',
            fontWeight: isChecked && isCorrect ? '600' : '500',
            fontSize: '18px',
            outline: 'none',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
          autoComplete="off"
          placeholder="Type the word..."
        />
        
        {isChecked && (
          isCorrect ? <span style={{ color: '#14B24C', fontSize: 22, marginLeft: 4 }}>✔️</span> : <span style={{ color: '#f44336', fontSize: 22, marginLeft: 4 }}>❌</span>
        )}
      </div>
      
      <ActionButtons buttons={actionButtons} />

      {/* Keyboard Shortcuts inside card */}
      <KeyboardShortcuts />

      <AnswerDisplay
        showAnswer={showAnswer}
        onToggleAnswer={onToggleAnswer}
        answers={answerItems}
        title="Word:"
      />
    </div>
  );
};

export default MainPracticeCard;
