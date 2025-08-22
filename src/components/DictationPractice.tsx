import React, { useState, useEffect, useRef } from 'react';
import { vocabularyService, ToeicVocabulary, VocabularyItem } from '../services';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowBack, 
  CheckCircle,
  ArrowForward, 
  FastForward 
} from '@mui/icons-material';
import {
  useAudioManager,
  FloatingBubbles,
} from './common';
import {
  SuccessModal,
  HeaderSection,
  MainSection,
  FooterSection,
} from './DictationPractice/index';
import { exampleGenerationService } from '../services';
import styles from './DictationPractice.module.css';

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
  const [hasPlayedInitialAudio, setHasPlayedInitialAudio] = useState(false);
  const [exampleSentence, setExampleSentence] = useState<ExampleSentence | null>(null);
  const [isGeneratingExample, setIsGeneratingExample] = useState(false);
  const [generatedExamples] = useState<string[]>([]);
  const [exampleError, setExampleError] = useState<string | null>(null);
  const [currentExamples, setCurrentExamples] = useState<ExampleSentence[]>([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [totalSets, setTotalSets] = useState(0);

  // Use common audio manager
  const { playSuccessSound, playErrorSound, handlePlayAudio } = useAudioManager(soundEnabled);

  // Load vocabulary data from API
  useEffect(() => {
    let isMounted = true;
    
    const loadVocabulary = async () => {
      try {
        if (!isMounted) return;
        
        setIsLoading(true);
        setIsSetLoaded(false);
        setError(null);
        
        
        // Get the specific vocabulary set by topic and set index
        const currentSetVocab = await vocabularyService.getVocabularySetByTopicAndSetIndex(topicFromUrl, topicSetIndex);
        
        if (!isMounted) return;
        
        // Convert ToeicVocabulary to VocabularyItem format
        const vocabItems: VocabularyItem[] = currentSetVocab.map((vocab: ToeicVocabulary) => 
          vocabularyService.convertToVocabularyItem(vocab)
        );
        
        setVocabList(vocabItems);
        
        // Get total sets count for navigation
        const totalSetsCount = await vocabularyService.getTotalSetsCount();
        
        if (!isMounted) return;
        
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
        setHasPlayedInitialAudio(false); // Reset for new set
        
      } catch (err) {
        if (!isMounted) return;
        
        console.error(`[DictationPractice] Error loading vocabulary for topic ${topicFromUrl} and set ${topicSetIndex}:`, err);
        setError('Failed to load vocabulary data. Please try again.');
        setVocabList([]);
        setIsSetLoaded(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadVocabulary();
    
    return () => {
      isMounted = false;
    };
  }, [topicFromUrl, topicSetIndex]);

  const handleInputChange = (value: string) => {
    const newInputs = [...userInputs];
    newInputs[currentIndex] = value;
    setUserInputs(newInputs);
    
    // Only reset result and hide modal if user is changing their answer after checking
    if (result[currentIndex] !== null) {
      const newResult = [...result];
      newResult[currentIndex] = null;
      setResult(newResult);
      
      // Hide answer and modal if they were shown, so user can retry
      if (showAnswer) {
        setShowAnswer(false);
      }
      if (showModal) {
        setShowModal(false);
      }
    } else if (showModal) {
      // If no result yet but modal is shown, hide it when user types
      setShowModal(false);
    }
  };

  const handleCheck = async () => {
    const normalize = (str: string) =>
      (str || '')
        .trim()
        .normalize('NFC')
        .replace(/\W/g, '')
        .toLowerCase();
    
    // Use currentIndex directly for consistency
    const currentItem = vocabList[currentIndex];
    if (!currentItem) {
      console.error('No current item found');
      return;
    }
    
    const isCorrectNow = normalize(currentItem.word) === normalize(userInputs[currentIndex] || '');
    

    
    // Update result state
    setResult(prevResult => {
      const newResult = [...prevResult];
      newResult[currentIndex] = isCorrectNow;
      return newResult;
    });
    
    if (isCorrectNow) {
      // Set states immediately for instant feedback
      setShowAnswer(true);
      setShowModal(true);
      justCheckedRef.current = true; // Set flag to prevent reset effect from running
      
      // Reset the flag after a delay to allow normal navigation
      setTimeout(() => {
        justCheckedRef.current = false;
      }, 500);
      
      // Play success sound only, don't play word audio to avoid duplicate audio
      try {
        await playSuccessSound();
      } catch (error) {
        console.error('Error playing success sound:', error);
      }
    } else {
      // Play error sound in background (non-blocking)
      playErrorSound().catch(console.error);
    }
  };

  const handleNext = () => {
    // Reset states immediately when moving to next word
    setShowAnswer(false);
    setShowModal(false);
    justCheckedRef.current = false; // Reset flag when moving to next word
    
    // If this is the last word in the current set
    if (safeCurrentIndex === vocabList.length - 1) {
      // Navigate to next set if available
      if (setIdx < totalSets - 1) {
        const nextSetIndex = topicSetIndex + 1;
        const encodedTopic = encodeURIComponent(topicFromUrl);
        navigate(`/dictation/${setIdx + 1}?topic=${encodedTopic}&setIndex=${nextSetIndex}`);
      } else {
        // If no more sets, go back to list
        navigate('/');
      }
    } else {
      // Move to next word in current set
      setCurrentIndex(safeCurrentIndex + 1);
      
      // Reset result and user input for the new word to ensure clean state
      const newResult = [...result];
      const newUserInputs = [...userInputs];
      newResult[safeCurrentIndex + 1] = null;
      newUserInputs[safeCurrentIndex + 1] = '';
      setResult(newResult);
      setUserInputs(newUserInputs);
    }
  };

  const handlePrev = () => {
    if (safeCurrentIndex > 0) setCurrentIndex(safeCurrentIndex - 1);
  };

  const handleGenerateExample = async () => {
    if (!item) return;
    
    try {
      setIsGeneratingExample(true);
      setExampleError(null);
      
      // Call OpenAI service to generate new example with topic
      const result = await exampleGenerationService.generateExampleSentence({
        word: item.word,
        meaning: item.meaning,
        type: item.type,
        existingExamples: currentExamples.map(ex => ex.englishSentence)
      }, topicFromUrl);
      
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
    let isMounted = true;
    
    if (vocabList.length > 0 && !isLoading && isSetLoaded && currentIndex > 0) {
      const item = vocabList[currentIndex];
      // Only play audio when moving to a new word, not when first loading
      // Add delay to avoid audio conflicts
      const timer = setTimeout(() => {
        if (isMounted) {
          handlePlayAudio(item.audio, item.word);
        }
      }, 300);
      
      // Load examples from database for new word
      loadExamplesFromDatabase(item.word);
      
      return () => {
        clearTimeout(timer);
        isMounted = false;
      };
    }
    
    // Only reset states when moving to a new word, not on initial load
    if (currentIndex > 0) {
      if (isMounted) {
        setShowAnswer(false);
        // Chỉ reset showModal khi thực sự chuyển sang từ mới, không phải khi đang check
        if (!isChecked && currentIndex > 0) {
          setShowModal(false);
        }
        
        // Don't reset examples here, let loadExamplesFromDatabase handle it
        setExampleSentence(null); // Reset example sentence when moving to next word
        // setGeneratedExamples([]); // Reset generated examples for new word
        setExampleError(null);
        
        // Focus input when moving to new word
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isLoading, isSetLoaded]); // Remove hasPlayedInitialAudio dependency to prevent audio replay

  // Khi vocabList thay đổi (load set mới), kiểm tra examples của từ đầu tiên và focus input
  useEffect(() => {
    if (vocabList.length > 0 && !isLoading && isSetLoaded && currentIndex === 0) {
      const item = vocabList[currentIndex];
      
      // Load existing examples from database first
      loadExamplesFromDatabase(item.word);
      
      // Focus input when starting new set
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [vocabList, isLoading, isSetLoaded, currentIndex]);

  // Load examples from database for current word
  const loadExamplesFromDatabase = async (word: string) => {
    try {
      
      // Import exampleService dynamically
      const { exampleService } = await import('../services/exampleService');
      const storedExamples = await exampleService.getExampleSentencesByWord(word);
      
      
      if (storedExamples.length > 0) {
        const examples = storedExamples.map(stored => 
          exampleService.convertToExampleSentence(stored)
        );
        
        
        setCurrentExamples(examples);
        setCurrentExampleIndex(0);
        setExampleSentence(examples[0]);
        
      } else {
        // Only reset if no examples found in database
        setCurrentExamples([]);
        setCurrentExampleIndex(0);
        setExampleSentence(null);
      }
    } catch (error) {
      console.error('Error loading examples from database:', error);
      // Don't show error to user, just log it
    }
  };

  // Load examples when currentIndex changes (for any word)
  useEffect(() => {
    if (vocabList.length > 0 && !isLoading && isSetLoaded && currentIndex >= 0) {
      const item = vocabList[currentIndex];
      if (item) {
        // Only load examples when moving to a new word, not when checking answers
        if (!justCheckedRef.current) {
          loadExamplesFromDatabase(item.word);
        }
      }
    }
  }, [currentIndex, vocabList, isLoading, isSetLoaded]);

  // Single focus effect when set is loaded
  useEffect(() => {
    
    
    if (vocabList.length > 0 && !isLoading && isSetLoaded) {
      // Single focus attempt with reasonable delay
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [vocabList, isLoading, isSetLoaded]);

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

  // Handle audio when vocabList changes (new set loaded) - only play once when set is first loaded
  useEffect(() => {
    let isMounted = true;
    
    if (vocabList.length > 0 && !isLoading && isSetLoaded && currentIndex === 0 && !hasPlayedInitialAudio) {
      const item = vocabList[currentIndex];
      // Only play audio once when the set is first loaded, with a small delay to avoid conflicts
      const timer = setTimeout(() => {
        if (isMounted) {
          handlePlayAudio(item.audio, item.word);
          setHasPlayedInitialAudio(true); // Mark as played
        }
      }, 500); // Delay to avoid audio conflicts
      
      return () => {
        clearTimeout(timer);
        isMounted = false;
      };
    }
    
    return () => {
      isMounted = false;
    };
  }, [vocabList, isLoading, isSetLoaded]); // Remove hasPlayedInitialAudio dependency to prevent infinite loop

  // Safety check to ensure currentIndex is within bounds
  const safeCurrentIndex = Math.min(currentIndex, vocabList.length - 1);
  const item = vocabList[safeCurrentIndex];
  
  // Use currentIndex for result checking to ensure consistency
  const isChecked = result[currentIndex] !== null;
  const isCorrect = result[currentIndex] === true;
  const progress = Math.round(((safeCurrentIndex + 1) / vocabList.length) * 100);
  const showNextButton = isChecked && isCorrect;
  // const isSetCompleted = isCorrect && safeCurrentIndex === vocabList.length - 1;

  

  // Count completed sentences and save to localStorage
  useEffect(() => {
    const completedCount = result.filter(r => r === true).length;
    if (completedCount !== completedSentences) {
      setCompletedSentences(completedCount);
      localStorage.setItem('vocab-completed-sentences', JSON.stringify(completedCount));
    }
  }, [result]); // Remove completedSentences dependency to prevent infinite loop

  // Reset result array when vocabList changes (only when length actually changes)
  useEffect(() => {
    if (vocabList.length > 0 && (result.length !== vocabList.length || userInputs.length !== vocabList.length)) {
      setResult(Array(vocabList.length).fill(null));
      setUserInputs(Array(vocabList.length).fill(''));
    }
  }, [vocabList.length]); // Remove userInputs.length dependency to prevent infinite loop

  // Reset states when currentIndex changes (when navigating between words)
  useEffect(() => {
    // Only reset states when actually moving to a different word, not on initial load or when checking answers
    // Use a ref to track if we're in the middle of checking an answer
    if ((currentIndex > 0 || hasPlayedInitialAudio) && !justCheckedRef.current) {
      setShowAnswer(false);
      setShowModal(false);
    }
  }, [currentIndex]); // Remove hasPlayedInitialAudio dependency to prevent infinite loop

  // Global keyboard event listener for Enter key when modal is shown
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showModal && showNextButton && !justCheckedRef.current) {
        e.preventDefault();
        justCheckedRef.current = true;
        handleNext();
        // Reset justCheckedRef after a short delay
        setTimeout(() => { justCheckedRef.current = false; }, 100);
      }
    };

    if (showModal && showNextButton) {
      document.addEventListener('keydown', handleGlobalKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [showModal, showNextButton]);

  // Removed duplicate keydown event listener to avoid conflicts
  // The handleKeyDown function in MainPracticeCard handles all keyboard events

  if (isLoading) return (
    <div className={styles.loadingContainer}>
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className={styles.loadingContent}>
          <h3 className={styles.loadingTitle}>Loading...</h3>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className={styles.errorContainer}>
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className={styles.errorContent}>
          <h3 className={styles.errorTitle}>Error</h3>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
  
  if (vocabList.length === 0) return (
    <div className={styles.noDataContainer}>
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className={styles.noDataContent}>
          <h3 className={styles.noDataTitle}>No data available!</h3>
          <p className={styles.noDataMessage}>There are no vocabulary sets available at the moment.</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.refreshButton}
          >
            Refresh
          </button>
        </div>
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
      text: 'ArrowBack',
      icon: <ArrowBack />,
      onClick: handlePrev,
      variant: 'secondary' as const,
      disabled: currentIndex === 0,
      show: true
    },
    {
      text: 'Check',
      icon: <CheckCircle />,
      onClick: handleCheck,
      variant: 'success' as const,
      disabled: !userInputs[currentIndex],
      show: !isChecked
    },
    {
      text: safeCurrentIndex === vocabList.length - 1 
        ? (setIdx < totalSets - 1 ? 'Next Set' : 'Finish')
        : 'Next',
      icon: <ArrowForward />,
      onClick: handleNext,
      variant: 'primary' as const,
      disabled: false,
      show: showNextButton
    },
    {
      text: 'FastForward',
      icon: <FastForward />,
      onClick: handleNext,
      variant: 'warning' as const,
      disabled: false,
      show: safeCurrentIndex !== vocabList.length - 1
    }
  ];

  // Answer display configuration
  // const answerItems = showAnswer ? [{
  //   word: item.word,
  //   phonetic: item.phonetic,
  //   type: item.type,
  //   meaning: item.meaning
  // }] : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {

    
    if (e.key === 'Enter') {
      
      
      if (!isChecked) {
        
        e.preventDefault(); // Prevent default form submission
        handleCheck().catch(console.error); // Handle async function properly
        // Không set justCheckedRef ngay lập tức, để người dùng có thể nhấn Enter để tiếp tục
        // justCheckedRef chỉ được set khi thực sự nhấn Next
      } else if (showNextButton && !justCheckedRef.current) {
        
        e.preventDefault(); // Prevent default form submission
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
    <div className={styles.container}>
      
      {/* Floating Bubbles Background Effect */}
      <FloatingBubbles particleCount={40} variant="mixed" />
      


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

      {/* Section 1: Header - Progress, Topic, Word Count */}
      <HeaderSection
        topic={topic}
        currentIndex={currentIndex}
        vocabListLength={vocabList.length}
        progress={progress}
        setIdx={setIdx}
        totalSets={totalSets}
        completedSentences={completedSentences}
        onBack={handleNavigateHome}
      />

      {/* Section 2: Main - Audio, Input, Buttons */}
      <MainSection
        item={item}
        currentIndex={currentIndex}
        vocabListLength={vocabList.length}
        userInputs={userInputs}
        result={result}
        showAnswer={showAnswer}
        showNextButton={showNextButton}
        isChecked={isChecked}
        isCorrect={isCorrect}
        soundEnabled={soundEnabled}
        actionButtons={actionButtons}
        onInputChange={handleInputChange}
        onPlayAudio={handlePlayAudio}
        onToggleAnswer={handleToggleAnswer}
        onKeyDown={handleKeyDown}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Section 3: Footer - Keyboard Shortcuts, Status, Tips */}
      <FooterSection
        showAnswer={showAnswer}
        isChecked={isChecked}
        isCorrect={isCorrect}
      />
    </div>
  );
};

export default DictationPractice;