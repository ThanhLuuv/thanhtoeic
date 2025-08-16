import React, { useState, useEffect, useRef } from 'react';
import { toeicVocabularyService, ToeicVocabulary, VocabularyItem } from '../services';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  useAudioManager,
} from './common';
import {
  SuccessModal,
  MainPracticeCard,
} from './DictationPractice/index';
import { exampleGenerationService } from '../services';

// Define interfaces for API responses
interface ExampleSentence {
  englishSentence: string;
  vietnameseTranslation: string;
  contextInfo?: string;
}

const NUM_WORDS = 20;

const DictationPractice: React.FC = () => {
  const { setIndex } = useParams<{ setIndex?: string }>();
  const location = useLocation();
  const setIdx = Number(setIndex) || 0;
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const topicFromUrl = queryParams.get('topic') || 'Other';
  const topicSetIndex = Number(queryParams.get('setIndex')) || 0;
  
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>(Array(NUM_WORDS).fill(''));
  const [result, setResult] = useState<(boolean | null)[]>(Array(NUM_WORDS).fill(null));
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [userRevealedAnswers, setUserRevealedAnswers] = useState<boolean[]>(Array(NUM_WORDS).fill(false));
  const [showModal, setShowModal] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const justCheckedRef = useRef(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSentences, setCompletedSentences] = useState<number>(0);
  const [isSetLoaded, setIsSetLoaded] = useState(false);
  const [exampleSentence, setExampleSentence] = useState<ExampleSentence | null>(null);
  const [isGeneratingExample, setIsGeneratingExample] = useState(false);
  const [generatedExamples, setGeneratedExamples] = useState<string[]>([]);
  const [exampleError, setExampleError] = useState<string | null>(null);
  const [currentExamples, setCurrentExamples] = useState<ExampleSentence[]>([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [totalSets, setTotalSets] = useState(0);

  // Use common audio manager
  const { playSuccessSound, playErrorSound, handlePlayAudio } = useAudioManager(soundEnabled);

  // Load vocabulary data from API
  useEffect(() => {
    const loadVocabulary = async () => {
      try {
        setIsLoading(true);
        setIsSetLoaded(false);
        setError(null);
        
        console.log(`[DictationPractice] Loading vocabulary for topic: ${topicFromUrl}, set index: ${topicSetIndex}`);
        
        // Get the specific vocabulary set by topic and set index
        const currentSetVocab = await toeicVocabularyService.getVocabularySetByTopicAndSetIndex(topicFromUrl, topicSetIndex);
        
        console.log(`[DictationPractice] Loaded vocabulary set:`, {
          topic: topicFromUrl,
          topicSetIndex,
          wordCount: currentSetVocab.length,
          words: currentSetVocab.map(v => v.word)
        });
        
        // Convert ToeicVocabulary to VocabularyItem format
        const vocabItems: VocabularyItem[] = currentSetVocab.map((vocab: ToeicVocabulary) => 
          toeicVocabularyService.convertToVocabularyItem(vocab)
        );
        
        setVocabList(vocabItems);
        
        // Get total sets count for navigation
        const totalSetsCount = await toeicVocabularyService.getTotalSetsCount();
        setTotalSets(totalSetsCount);
        
        // Reset user inputs and results for the new set
        setUserInputs(Array(vocabItems.length).fill(''));
        setResult(Array(vocabItems.length).fill(null));
        setCurrentIndex(0);
        setShowAnswer(false);
        setUserRevealedAnswers(Array(vocabItems.length).fill(false));
        setShowModal(false);
        
        // Mark set as loaded
        setIsSetLoaded(true);
        
      } catch (err) {
        console.error(`[DictationPractice] Error loading vocabulary for topic ${topicFromUrl} and set ${topicSetIndex}:`, err);
        setError('Failed to load vocabulary data. Please try again.');
        setVocabList([]);
        setIsSetLoaded(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadVocabulary();
  }, [topicFromUrl, topicSetIndex]);

  const handleInputChange = (value: string) => {
    const newInputs = [...userInputs];
    newInputs[currentIndex] = value;
    setUserInputs(newInputs);
    // Reset result for this word so user can retry immediately
    const newResult = [...result];
    newResult[currentIndex] = null;
    setResult(newResult);
  };

  const handleCheck = async () => {
    const normalize = (str: string) =>
      (str || '')
        .trim()
        .normalize('NFC')
        .replace(/\W/g, '')
        .toLowerCase();
    const newResult = [...result];
    const currentItem = vocabList[currentIndex];
    const isCorrectNow = normalize(currentItem.word) === normalize(userInputs[currentIndex]);
    newResult[currentIndex] = isCorrectNow;
    setResult(newResult);
    
    
    if (isCorrectNow) {
      await playSuccessSound();
      setShowAnswer(true);
      setShowModal(true);
      // Reset justCheckedRef để người dùng có thể nhấn Enter ngay lập tức
      justCheckedRef.current = false;
    } else {
      await playErrorSound();
    }
  };

  const handleNext = () => {
    // If this is the last word in the current set
    if (currentIndex === vocabList.length - 1) {
      // Navigate to next set if available
      if (setIdx < totalSets - 1) {
        const nextSetIndex = topicSetIndex + 1;
        const encodedTopic = encodeURIComponent(topicFromUrl);
        navigate(`/dictation/${setIdx + 1}?topic=${encodedTopic}&setIndex=${nextSetIndex}`);
      } else {
        // If no more sets, go back to list
        navigate('/dictation-list');
      }
    } else {
      // Move to next word in current set
      setCurrentIndex(currentIndex + 1);
    }
    setShowModal(false);
    // Reset justCheckedRef khi chuyển sang từ mới
    justCheckedRef.current = false;
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleGenerateExample = async () => {
    if (!item) return;
    
    try {
      setIsGeneratingExample(true);
      setExampleError(null);
      
      // Call OpenAI service to generate new example
      const result = await exampleGenerationService.generateExampleSentence({
        word: item.word,
        meaning: item.meaning,
        type: item.type,
        existingExamples: currentExamples.map(ex => ex.englishSentence)
      });
      
      if (result.exampleSentence) {
        const newExample = {
          englishSentence: result.exampleSentence.english,
          vietnameseTranslation: result.exampleSentence.vietnamese,
          contextInfo: result.exampleSentence.context,
        };
        
        // Add new example to list and display
        const updatedExamples = [...currentExamples, newExample];
        setCurrentExamples(updatedExamples);
        setCurrentExampleIndex(updatedExamples.length - 1); // Show the newest example
        setExampleSentence(newExample);
      } else {
        setExampleError('Unable to generate new example sentence.');
      }
    } catch (err: any) {
      console.error('Error generating example:', err);
      setExampleError(err.message || 'Error generating example sentence.');
    } finally {
      setIsGeneratingExample(false);
    }
  };

  const handleNextExample = () => {
    if (currentExampleIndex < currentExamples.length - 1) {
      const nextIndex = currentExampleIndex + 1;
      setCurrentExampleIndex(nextIndex);
      const nextExample = currentExamples[nextIndex];
      setExampleSentence({
        englishSentence: nextExample.englishSentence,
        vietnameseTranslation: nextExample.vietnameseTranslation,
        contextInfo: nextExample.contextInfo,
      });
    }
  };

  const handlePrevExample = () => {
    if (currentExampleIndex > 0) {
      const prevIndex = currentExampleIndex - 1;
      setCurrentExampleIndex(prevIndex);
      const prevExample = currentExamples[prevIndex];
      setExampleSentence({
        englishSentence: prevExample.englishSentence,
        vietnameseTranslation: prevExample.vietnameseTranslation,
        contextInfo: prevExample.contextInfo,
      });
    }
  };

  // Khi chuyển sang từ mới, kiểm tra examples có sẵn
  useEffect(() => {
    if (vocabList.length > 0 && !isLoading && isSetLoaded && currentIndex > 0) {
      const item = vocabList[currentIndex];
      handlePlayAudio(item.audio, item.word);
    }
    setShowAnswer(false);
    // Chỉ reset showModal khi thực sự chuyển sang từ mới, không phải khi đang check
    // Và chỉ reset khi không phải là lần đầu load
    if (!isChecked && currentIndex > 0) {
      setShowModal(false);
    }
    setExampleSentence(null); // Reset example sentence when moving to next word
    setGeneratedExamples([]); // Reset generated examples for new word
    setCurrentExamples([]); // Reset current examples
    setCurrentExampleIndex(0); // Reset example index
    setExampleError(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isLoading, isSetLoaded]);

  // Khi vocabList thay đổi (load set mới), kiểm tra examples của từ đầu tiên
  useEffect(() => {
    if (vocabList.length > 0 && !isLoading && isSetLoaded && currentIndex === 0) {
      const item = vocabList[currentIndex];
      handlePlayAudio(item.audio, item.word);
      
      // Check if examples are available
      if (item.exampleSentences && Array.isArray(item.exampleSentences) && item.exampleSentences.length > 0) {
        // Convert to ExampleSentence format if needed
        const examples: ExampleSentence[] = item.exampleSentences.map((ex: any) => ({
          englishSentence: ex.englishSentence || ex.english || '',
          vietnameseTranslation: ex.vietnameseTranslation || ex.vietnamese || '',
          contextInfo: ex.contextInfo || ex.context || '',
        }));
        setCurrentExamples(examples);
        setCurrentExampleIndex(0);
        setExampleSentence(examples[0]);
      } else {
        setCurrentExamples([]);
        setCurrentExampleIndex(0);
        setExampleSentence(null);
      }
    }
  }, [vocabList, isLoading, isSetLoaded, currentIndex]);

  // Load completed sentences count from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vocab-completed-sentences');
    if (saved) {
      setCompletedSentences(JSON.parse(saved));
    }
  }, []);

  // Reset isSetLoaded when setIndex changes
  useEffect(() => {
    setIsSetLoaded(false);
  }, [setIndex]);

  // Handle audio when vocabList changes (new set loaded)
  useEffect(() => {
    if (vocabList.length > 0 && !isLoading && isSetLoaded && currentIndex === 0) {
      const item = vocabList[currentIndex];
      handlePlayAudio(item.audio, item.word);
    }
  }, [vocabList, isLoading, isSetLoaded, currentIndex]);

  const item = vocabList[currentIndex];
  const isChecked = result[currentIndex] !== null;
  const isCorrect = result[currentIndex] === true;
  const progress = Math.round(((currentIndex + 1) / vocabList.length) * 100);
  const showNextButton = isChecked && isCorrect;
  const isSetCompleted = isCorrect && currentIndex === vocabList.length - 1;

  // Count completed sentences and save to localStorage
  useEffect(() => {
    const completedCount = result.filter(r => r === true).length;
    if (completedCount !== completedSentences) {
      setCompletedSentences(completedCount);
      localStorage.setItem('vocab-completed-sentences', JSON.stringify(completedCount));
    }
  }, [result, completedSentences]);

  // Removed duplicate keydown event listener to avoid conflicts
  // The handleKeyDown function in MainPracticeCard handles all keyboard events

  if (isLoading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f9fb',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '90%',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px',
        }}></div>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '12px',
        }}>
          Đang tải...
        </h3>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          margin: 0,
        }}>
          Đang tải dữ liệu từ vựng
        </p>
      </div>
    </div>
  );
  
  if (error) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f9fb',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '90%',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 20px',
          color: '#ef4444',
        }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '12px',
        }}>
          Có lỗi xảy ra
        </h3>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          marginBottom: '24px',
        }}>
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Thử lại
        </button>
      </div>
    </div>
  );
  
  if (vocabList.length === 0) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f9fb',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '90%',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 20px',
          color: '#64748b',
        }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '12px',
        }}>
          Không có dữ liệu
        </h3>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          margin: 0,
        }}>
          Không có từ vựng nào khả dụng
        </p>
      </div>
    </div>
  );

  function getSetTopic() {
    // Use topic from URL instead of from vocabList
    return topicFromUrl;
  }
  const topic = getSetTopic();

  // Action buttons configuration
  const actionButtons = [
    {
      text: '←',
      onClick: handlePrev,
      variant: 'secondary' as const,
      disabled: currentIndex === 0,
      show: true
    },
    {
      text: 'Check',
      onClick: handleCheck,
      variant: 'success' as const,
      disabled: !userInputs[currentIndex],
      show: !isChecked
    },
    {
      text: currentIndex === vocabList.length - 1 
        ? (setIdx < totalSets - 1 ? 'Next Set' : 'Finish')
        : 'Next',
      onClick: handleNext,
      variant: 'primary' as const,
      show: showNextButton
    },
    {
      text: '⏭',
      onClick: handleNext,
      variant: 'warning' as const,
      show: currentIndex !== vocabList.length - 1
    }
  ];

  // Answer display configuration
  const answerItems = showAnswer ? [{
    word: item.word,
    phonetic: item.phonetic,
    type: item.type,
    meaning: item.meaning
  }] : [];

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isChecked) {
        await handleCheck();
        // Không set justCheckedRef ngay lập tức, để người dùng có thể nhấn Enter để tiếp tục
        // justCheckedRef chỉ được set khi thực sự nhấn Next
      } else if (showNextButton && !justCheckedRef.current) {
        justCheckedRef.current = true; // Set flag khi thực sự nhấn Next
        handleNext();
      }
      // Reset justCheckedRef sau khi xử lý xong
      setTimeout(() => { justCheckedRef.current = false; }, 100);
    }
    if (e.key === 'Shift' && e.shiftKey && !e.repeat) {
      e.preventDefault();
      handlePlayAudio(item.audio, item.word);
    }
    if (e.key === 'Control' && e.ctrlKey && !e.repeat) {
      e.preventDefault();
      setShowAnswer(prev => !prev);
    }
  };

  const handleToggleAnswer = () => {
    setShowAnswer(true);
    const newRevealed = [...userRevealedAnswers];
    newRevealed[currentIndex] = true;
    setUserRevealedAnswers(newRevealed);
  };

  const handleNavigateHome = () => navigate('/');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f9fb',
      position: 'relative',
    }}>

      {/* Back Button */}
      <button
        onClick={handleNavigateHome}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '12px 20px',
          backgroundColor: '#64748b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          zIndex: 1000,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#475569';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#64748b';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to List
      </button>

      {/* Success Modal */}
      <SuccessModal
        showModal={showModal}
        isCorrect={isCorrect}
        showNextButton={showNextButton}
        item={item}
        currentIndex={currentIndex}
        vocabListLength={vocabList.length}
        setIdx={setIdx}
        totalSets={totalSets}
        isGeneratingExample={isGeneratingExample}
        exampleError={exampleError}
        exampleSentence={exampleSentence}
        currentExamples={currentExamples}
        currentExampleIndex={currentExampleIndex}
        onGenerateExample={handleGenerateExample}
        onNext={handleNext}
        onNextExample={handleNextExample}
        onPrevExample={handlePrevExample}
      />

      {/* Main Practice Card */}
      <MainPracticeCard
        item={item}
        currentIndex={currentIndex}
        vocabListLength={vocabList.length}
        progress={progress}
        soundEnabled={soundEnabled}
        userInputs={userInputs}
        result={result}
        showAnswer={showAnswer}
        showNextButton={showNextButton}
        isChecked={isChecked}
        isCorrect={isCorrect}
        topic={topic}
        setIdx={setIdx}
        completedSentences={completedSentences}
        actionButtons={actionButtons}
        answerItems={answerItems}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
        onInputChange={handleInputChange}
        onPlayAudio={handlePlayAudio}
        onToggleAnswer={handleToggleAnswer}
        onKeyDown={handleKeyDown}
      />

      {/* Responsive style */}
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (max-width: 600px) {
          div[style*='max-width: 400px'] {
            max-width: 98vw !important;
            padding: 10px !important;
          }
          input[type='text'] {
            width: 90vw !important;
            min-width: 0 !important;
            font-size: 16px !important;
          }
          div[style*='gap: 20px'] {
            gap: 8px !important;
            flex-wrap: wrap !important;
          }
          div[style*='gap: 20px'] span {
            font-size: 10px !important;
            padding: 1px 4px !important;
          }
          div[style*='gap: 20px'] kbd {
            font-size: 9px !important;
            padding: 1px 3px !important;
          }
          div[style*='max-width: 400px'][style*='padding: 32px'] {
            padding: 20px !important;
            margin: 10px !important;
          }
          div[style*='max-width: 400px'][style*='padding: 32px'] h2 {
            font-size: 20px !important;
          }
          div[style*='max-width: 400px'][style*='padding: 32px'] div[style*='font-size: 28px'] {
            font-size: 24px !important;
          }
          div[style*='max-width: 400px'][style*='padding: 32px'] div[style*='font-size: 16px'] {
            font-size: 14px !important;
          }
          
          /* Back button responsive */
          button[onclick*='handleNavigateBack'] {
            top: 10px !important;
            left: 10px !important;
            padding: 8px 12px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DictationPractice;