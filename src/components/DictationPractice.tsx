import React, { useState, useEffect, useRef } from 'react';
import { toeicVocabularyService, ToeicVocabulary, VocabularyItem } from '../services/toeicVocabularyService';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useAudioManager,
} from './common';
import {
  SuccessModal,
  MainPracticeCard,
  CompletionButtons
} from './DictationPractice/index';
import { generateExampleAPI } from '../services/toeicVocabularyService';

// Define interfaces for API responses
interface ExampleSentence {
  englishSentence: string;
  vietnameseTranslation: string;
  contextInfo?: string;
}

interface GenerateExampleResponse {
  success: boolean;
  example?: ExampleSentence;
  message?: string;
}

const NUM_WORDS = 20;

const DictationPractice: React.FC = () => {
  const { setIndex } = useParams<{ setIndex?: string }>();
  const setIdx = Number(setIndex) || 0;
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
        
        // Get the specific vocabulary set by index
        const currentSetVocab = await toeicVocabularyService.getVocabularySetByIndex(setIdx);
        
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
        setError('Failed to load vocabulary data. Please try again.');
        setVocabList([]);
        setIsSetLoaded(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadVocabulary();
  }, [setIdx]);

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
        navigate(`/dictation/${setIdx + 1}`);
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
      
      // Call API to generate new example
      const result = await generateExampleAPI(item.id) as GenerateExampleResponse;
      if (result.success && result.example) {
        const newExample = {
          englishSentence: result.example.englishSentence,
          vietnameseTranslation: result.example.vietnameseTranslation,
          contextInfo: result.example.contextInfo,
        };
        
        // Add new example to list and display
        const updatedExamples = [...currentExamples, result.example];
        setCurrentExamples(updatedExamples);
        setCurrentExampleIndex(updatedExamples.length - 1); // Show the newest example
        setExampleSentence(newExample);
      } else {
        setExampleError(result.message || 'Unable to generate new example sentence.');
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

  if (isLoading) return <div>Đang loading...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</div>;
  if (vocabList.length === 0) return <div style={{ textAlign: 'center', marginTop: 40 }}>No data available!</div>;

  function getSetTopic() {
    // Get topic from the first word in the current vocabulary list
    if (vocabList.length > 0 && vocabList[0]) {
      return vocabList[0].topic || 'Other';
    }
    return 'Other';
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
  const handleNavigateNextSet = () => navigate(`/dictation/${setIdx + 1}`);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f9fb',
      position: 'relative',
    }}>

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
      {/* Completion Buttons */}
      <CompletionButtons
        currentIndex={currentIndex}
        vocabListLength={vocabList.length}
        isCorrect={isCorrect}
        setIdx={setIdx}
        totalSets={totalSets}
        completedSentences={completedSentences}
        onNavigateHome={handleNavigateHome}
        onNavigateNextSet={handleNavigateNextSet}
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
        }
      `}</style>
    </div>
  );
};

export default DictationPractice;