import React, { useState, useEffect, useRef } from 'react';
import { sentenceService, Sentence } from '../services';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle,
  ArrowForward, 
  FastForward,
  ArrowBack
} from '@mui/icons-material';
import {
  useAudioManager,
  FloatingBubbles,
} from './common';
import {
  HeaderSection,
  MainSection,
  SuccessModal,
  FooterSection,
  KeyboardShortcuts
} from './SentencePractice/index';
import styles from './SentencePractice.module.css';

const NUM_SENTENCES = 10;

const SentencePractice: React.FC = () => {
  const { setIndex } = useParams<{ setIndex?: string }>();
  const location = useLocation();
  const setIdx = Number(setIndex) || 0;
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const partFromUrl = queryParams.get('part') || 'part1';
  const partSetIndex = Number(queryParams.get('setIndex')) || 0;
  
  const [sentenceList, setSentenceList] = useState<Sentence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[][]>([]);
  const [result, setResult] = useState<(boolean | null)[]>(Array(NUM_SENTENCES).fill(null));
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const justCheckedRef = useRef(false);
  const wordResultsRef = useRef<boolean[][]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSentences, setCompletedSentences] = useState<number>(0);
  const [isSetLoaded, setIsSetLoaded] = useState(false);
  const [hasPlayedInitialAudio, setHasPlayedInitialAudio] = useState(false);
  const [totalSets, setTotalSets] = useState(0);

  // Use common audio manager
  const { playSuccessSound, playErrorSound, handlePlayAudio } = useAudioManager(soundEnabled);

  // Load sentence data from API
  useEffect(() => {
    let isMounted = true;
    
    const loadSentences = async () => {
      try {
        if (!isMounted) return;
        
        setIsLoading(true);
        setIsSetLoaded(false);
        setError(null);
        
        // Get the specific sentence set by part and set index
        const currentSetSentences = await sentenceService.getSentenceSetByPartAndSetIndex(partFromUrl as 'part1' | 'part2' | 'part3', partSetIndex);
        
        if (!isMounted) return;
        
        setSentenceList(currentSetSentences);
        
        // Get total sets count for navigation
        const totalSetsCount = await sentenceService.getTotalSetsCount();
        
        if (!isMounted) return;
        
        setTotalSets(totalSetsCount);
        
        // Reset user inputs and results for the new set
        const initialUserInputs = currentSetSentences.map(sentence => {
          const wordCount = sentence.englishSentence
            .split(' ')
            .filter(word => word.trim() !== '').length;
          return Array(wordCount).fill('');
        });
        setUserInputs(initialUserInputs);
        setResult(Array(currentSetSentences.length).fill(null));
        setCurrentIndex(0);
        setShowAnswer(false);
        setShowModal(false);
        
        // Mark set as loaded
        setIsSetLoaded(true);
        setHasPlayedInitialAudio(false); // Reset for new set
        
      } catch (err) {
        if (!isMounted) return;
        
        setError('Failed to load sentence data. Please try again.');
        setSentenceList([]);
        setIsSetLoaded(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSentences();
    
    return () => {
      isMounted = false;
    };
  }, [partFromUrl, partSetIndex]);

  const handleInputChange = (value: string, wordIndex: number) => {
    const newInputs = [...userInputs];
    if (!newInputs[currentIndex]) {
      newInputs[currentIndex] = [];
    }
    newInputs[currentIndex][wordIndex] = value;
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
    
    // Don't change focus - let user continue typing in the current input
  };

  const handleCheck = async () => {
    const normalize = (str: string) =>
      (str || '')
        .trim()
        .normalize('NFC')
        .replace(/\W/g, '')
        .toLowerCase();
    
    // Use currentIndex directly for consistency
    const currentItem = sentenceList[currentIndex];
    if (!currentItem) {
      console.error('No current item found');
      return;
    }
    
    // Get user input words for current sentence
    const userInputWords = userInputs[currentIndex] || [];
    const sentenceWords = currentItem.englishSentence
      .split(' ')
      .filter(word => word.trim() !== '');
    
    // Check each word individually and store results
    const wordResults: boolean[] = [];
    let allWordsCorrect = true;
    
    for (let i = 0; i < sentenceWords.length; i++) {
      const isWordCorrect = normalize(userInputWords[i] || '') === normalize(sentenceWords[i]);
      wordResults.push(isWordCorrect);
      if (!isWordCorrect) {
        allWordsCorrect = false;
      }
    }
    
    // Update result state for the current sentence
    setResult(prevResult => {
      const newResult = [...prevResult];
      newResult[currentIndex] = allWordsCorrect;
      return newResult;
    });
    
    // Store word-level results for individual input styling
    const newWordResults = [...(wordResultsRef.current || [])];
    newWordResults[currentIndex] = wordResults;
    wordResultsRef.current = newWordResults;
    
    if (allWordsCorrect) {
      // Set states immediately for instant feedback
      setShowAnswer(true);
      setShowModal(true);
      justCheckedRef.current = true; // Set flag to prevent reset effect from running
      
      // Reset the flag after a delay to allow normal navigation
      setTimeout(() => {
        justCheckedRef.current = false;
      }, 500);
      
      // Play success sound only, don't play sentence audio to avoid duplicate audio
      try {
        await playSuccessSound();
      } catch (error) {
        console.error('Error playing success sound:', error);
      }
    } else {
      // Show answer to let user see which words are correct/incorrect
      setShowAnswer(true);
      // Play error sound in background (non-blocking)
      playErrorSound().catch(console.error);
    }
  };

  const handleNext = () => {
    // Reset states immediately when moving to next sentence
    setShowAnswer(false);
    setShowModal(false);
    justCheckedRef.current = false; // Reset flag when moving to next sentence
    
    // If this is the last sentence in the current set
    if (safeCurrentIndex === sentenceList.length - 1) {
      // Navigate to next set if available
      if (setIdx < totalSets - 1) {
        const nextSetIndex = partSetIndex + 1;
        navigate(`/sentence-practice/${setIdx + 1}?part=${partFromUrl}&setIndex=${nextSetIndex}`);
      } else {
        // If no more sets, go back to list
        navigate('/');
      }
    } else {
      // Move to next sentence in current set
      setCurrentIndex(safeCurrentIndex + 1);
      
      // Reset result and user input for the new sentence to ensure clean state
      const newResult = [...result];
      const newUserInputs = [...userInputs];
      newResult[safeCurrentIndex + 1] = null;
      
      // Initialize correct number of input fields for next sentence
      const nextSentence = sentenceList[safeCurrentIndex + 1];
      if (nextSentence) {
        const wordCount = nextSentence.englishSentence
          .split(' ')
          .filter(word => word.trim() !== '').length;
        newUserInputs[safeCurrentIndex + 1] = Array(wordCount).fill('');
      }
      
      // Reset word results for the new sentence
      const newWordResults = [...(wordResultsRef.current || [])];
      newWordResults[safeCurrentIndex + 1] = [];
      wordResultsRef.current = newWordResults;
      
      setResult(newResult);
      setUserInputs(newUserInputs);
    }
  };

  const handlePrev = () => {
    if (safeCurrentIndex > 0) {
      setCurrentIndex(safeCurrentIndex - 1);
      // Reset states when going to previous sentence
      setShowAnswer(false);
      setShowModal(false);
      justCheckedRef.current = false;
      
      // Reset word results for the previous sentence
      const newWordResults = [...(wordResultsRef.current || [])];
      newWordResults[safeCurrentIndex - 1] = [];
      wordResultsRef.current = newWordResults;
    }
  };

  const handleToggleAnswer = () => {
    setShowAnswer(prev => !prev);
  };

  // Khi chuyển sang câu mới, kiểm tra audio
  useEffect(() => {
    let isMounted = true;
    
    if (sentenceList.length > 0 && !isLoading && isSetLoaded && currentIndex > 0) {
      const item = sentenceList[currentIndex];
      // Only play audio when moving to a new sentence, not when first loading
      // Add delay to avoid audio conflicts
      const timer = setTimeout(() => {
        if (isMounted) {
          handlePlayAudio(item.audio, item.englishSentence);
        }
      }, 300);
      
      return () => {
        clearTimeout(timer);
        isMounted = false;
      };
    }
    
    // Only reset states when moving to a new sentence, not on initial load
    if (currentIndex > 0) {
      if (isMounted) {
        setShowAnswer(false);
        // Chỉ reset showModal khi thực sự chuyển sang câu mới, không phải khi đang check
        if (!isChecked && currentIndex > 0) {
          setShowModal(false);
        }
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [currentIndex, isLoading, isSetLoaded]);

  // Khi sentenceList thay đổi (load set mới), kiểm tra audio của câu đầu tiên và focus input
  useEffect(() => {
    if (sentenceList.length > 0 && !isLoading && isSetLoaded && currentIndex === 0) {
      const item = sentenceList[currentIndex];
      
      // No need to focus input here, MainSection will handle it
    }
  }, [sentenceList, isLoading, isSetLoaded, currentIndex]);

  // Single focus effect when set is loaded
  useEffect(() => {
    if (sentenceList.length > 0 && !isLoading && isSetLoaded) {
      // No need to focus input here, MainSection will handle it
    }
  }, [sentenceList, isLoading, isSetLoaded]);

  // Load completed sentences count from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sentence-completed-sentences');
    if (saved) {
      setCompletedSentences(JSON.parse(saved));
    }
  }, []);

  // Reset isSetLoaded when setIndex changes
  useEffect(() => {
    setIsSetLoaded(false);
  }, [setIndex]);

  // Handle audio when sentenceList changes (new set loaded) - only play once when set is first loaded
  useEffect(() => {
    let isMounted = true;
    
    if (sentenceList.length > 0 && !isLoading && isSetLoaded && currentIndex === 0 && !hasPlayedInitialAudio) {
      const item = sentenceList[currentIndex];
      // Only play audio once when the set is first loaded, with a small delay to avoid conflicts
      const timer = setTimeout(() => {
        if (isMounted) {
          handlePlayAudio(item.audio, item.englishSentence);
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
  }, [sentenceList, isLoading, isSetLoaded]);

  // Safety check to ensure currentIndex is within bounds
  const safeCurrentIndex = Math.min(currentIndex, sentenceList.length - 1);
  const item = sentenceList[safeCurrentIndex];
  
  // Use currentIndex for result checking to ensure consistency
  const isChecked = result[currentIndex] !== null;
  const isCorrect = result[currentIndex] === true;
  const progress = Math.round(((safeCurrentIndex + 1) / sentenceList.length) * 100);
  const showNextButton = isChecked && isCorrect;

  // Count completed sentences and save to localStorage
  useEffect(() => {
    const completedCount = result.filter(r => r === true).length;
    if (completedCount !== completedSentences) {
      setCompletedSentences(completedCount);
      localStorage.setItem('sentence-completed-sentences', JSON.stringify(completedCount));
    }
  }, [result]);

  // Reset result array when sentenceList changes (only when length actually changes)
  useEffect(() => {
    if (sentenceList.length > 0 && (result.length !== sentenceList.length || userInputs.length !== sentenceList.length)) {
      setResult(Array(sentenceList.length).fill(null));
      const initialUserInputs = sentenceList.map(() => Array(10).fill(''));
      setUserInputs(initialUserInputs);
    }
  }, [sentenceList.length]);

  // Reset states when currentIndex changes (when navigating between sentences)
  useEffect(() => {
    // Only reset states when actually moving to a different sentence, not on initial load or when checking answers
    // Use a ref to track if we're in the middle of checking an answer
    if ((currentIndex > 0 || hasPlayedInitialAudio) && !justCheckedRef.current) {
      setShowAnswer(false);
      setShowModal(false);
    }
  }, [currentIndex]);

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
  
  if (sentenceList.length === 0) return (
    <div className={styles.noDataContainer}>
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className={styles.noDataContent}>
          <h3 className={styles.noDataTitle}>No data available!</h3>
          <p className={styles.noDataMessage}>There are no sentence sets available at the moment.</p>
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isChecked) {
        e.preventDefault(); // Prevent default form submission
        handleCheck().catch(console.error); // Handle async function properly
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
      handlePlayAudio(item.audio, item.englishSentence);
    }
    if (e.key === 'Control' && e.ctrlKey && !e.repeat) {
      e.preventDefault();
      setShowAnswer(prev => !prev);
    }
  };

  const handleNavigateHome = () => navigate('/');

  // Action buttons configuration
  const actionButtons = [
    {
      text: 'Prev',
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
      disabled: false, // Always enable check button
      show: !isChecked
    },
    {
      text: safeCurrentIndex === sentenceList.length - 1 
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
      show: safeCurrentIndex !== sentenceList.length - 1
    }
  ];

  return (
    <div className={styles.container}>
      
      {/* Floating Bubbles Background Effect */}
      <FloatingBubbles particleCount={40} variant="mixed" />

      {/* Success Modal */}
      <SuccessModal
        showModal={showModal && isCorrect}
        isCorrect={isCorrect}
        showNextButton={showNextButton}
        item={item}
        currentIndex={currentIndex}
        sentenceListLength={sentenceList.length}
        setIdx={setIdx}
        totalSets={totalSets}
        onNext={handleNext}
      />

      {/* Header Section */}
      <HeaderSection
        part={partFromUrl}
        currentIndex={safeCurrentIndex}
        sentenceListLength={sentenceList.length}
        progress={progress}
        setIdx={setIdx}
        totalSets={totalSets}
        completedSentences={completedSentences}
        onBack={handleNavigateHome}
      />

      {/* Main Practice Section */}
      <MainSection
        item={item}
        currentIndex={currentIndex}
        sentenceListLength={sentenceList.length}
        userInputs={userInputs}
        result={result}
        wordResults={wordResultsRef.current}
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

      {/* Footer Section */}
      <FooterSection
        showAnswer={showAnswer}
        isChecked={isChecked}
        isCorrect={isCorrect}
      />
    </div>
  );
};

export default SentencePractice;
