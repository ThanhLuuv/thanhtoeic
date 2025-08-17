import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { vocabularyService, ToeicVocabulary, VocabSetByTopic } from '../services';
import styles from './DictationList.module.css';

// Constants
const WORDS_PER_SET = 20;

// Types
interface VocabSet {
  set: ToeicVocabulary[];
  idx: number;
  originalIdx: number;
  topic?: string;
  topicSetIndex?: number; // Add this to track set index within topic
}

interface DictationListState {
  vocabSetsByTopic: VocabSetByTopic[];
  vocabCompletedSets: Set<number>;
  isLoading: boolean;
  error: string | null;
  hoverIdx: number | null;
}

// Utility functions
const getSetType = (set: ToeicVocabulary[]): string => {
  if (!set || set.length === 0) return '0 words';
  const hasPhrase = set.some(item => item.word && item.word.includes(' '));
  return hasPhrase ? '1 words or more' : '1 word';
};

const getGlobalVocabIndex = (
  topicIndex: number, 
  setIndex: number, 
  vocabSetsByTopic: VocabSetByTopic[]
): number => {
  let globalIndex = 0;
  for (let i = 0; i < topicIndex; i++) {
    const topicData = vocabSetsByTopic[i];
    if (topicData.sets && Array.isArray(topicData.sets)) {
      // Chỉ đếm các set hợp lệ
      const validSetsCount = topicData.sets.filter(set => 
        set && Array.isArray(set) && set.length > 0
      ).length;
      globalIndex += validSetsCount;
    }
  }
  return globalIndex + setIndex;
};

// Custom hooks
const useDictationListState = () => {
  const [state, setState] = useState<DictationListState>({
    vocabSetsByTopic: [],
    vocabCompletedSets: new Set(),
    isLoading: true,
    error: null,
    hoverIdx: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setVocabSetsByTopic = useCallback((sets: VocabSetByTopic[]) => {
    setState(prev => ({ ...prev, vocabSetsByTopic: sets }));
  }, []);

  const setVocabCompletedSets = useCallback((sets: Set<number>) => {
    setState(prev => ({ ...prev, vocabCompletedSets: sets }));
  }, []);

  const setHoverIdx = useCallback((idx: number | null) => {
    setState(prev => ({ ...prev, hoverIdx: idx }));
  }, []);

  return {
    state,
    setLoading,
    setError,
    setVocabSetsByTopic,
    setVocabCompletedSets,
    setHoverIdx,
  };
};

const useVocabularyData = () => {
  const { state, setLoading, setError, setVocabSetsByTopic } = useDictationListState();

  const loadVocabularyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const vocabSetsByTopicData = await vocabularyService.getVocabularySetsByTopic();
      setVocabSetsByTopic(vocabSetsByTopicData);
      
    } catch (error) {
      console.error('Error loading vocabulary:', error);
      setError('Failed to load vocabulary data. Please try again.');
      setVocabSetsByTopic([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setVocabSetsByTopic]);

  return {
    vocabSetsByTopic: state.vocabSetsByTopic,
    isLoading: state.isLoading,
    error: state.error,
    loadVocabularyData,
  };
};

const useCompletedSets = () => {
  const { state, setVocabCompletedSets } = useDictationListState();

  const loadCompletedSets = useCallback(() => {
    const vocabSavedSets = localStorage.getItem('vocab-completed-sets');
    if (vocabSavedSets) {
      try {
        const parsed = JSON.parse(vocabSavedSets);
        setVocabCompletedSets(new Set(parsed));
      } catch (e) {
        console.error('Error loading completed sets:', e);
      }
    }
  }, [setVocabCompletedSets]);

  return {
    vocabCompletedSets: state.vocabCompletedSets,
    loadCompletedSets,
  };
};

// Components
const LoadingSpinner: React.FC = () => (
  <div className={styles.loadingSpinner}>
      <h3 className={styles.loadingTitle}>Loading...</h3>
  </div>
);

const ErrorMessage: React.FC<{ error: string }> = ({ error }) => (
  <div className={styles.errorMessage}>
      <h3 className={styles.errorTitle}>Error</h3>
      <p className={styles.errorText}>{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className={styles.retryButton}
      >
        Try again
      </button>
  </div>
);

const VocabSetCard: React.FC<{
  vocabSet: VocabSet;
  isCompleted: boolean;
  isHovered: boolean;
  onHover: (idx: number | null) => void;
  onClick: (originalIdx: number, topic: string, topicSetIndex: number) => void;
}> = ({ vocabSet, isCompleted, isHovered, onHover, onClick }) => {
  const { set, idx, originalIdx, topic, topicSetIndex } = vocabSet;

  return (
    <div
      className={`${styles.vocabCard} ${isHovered ? styles.hovered : ''}`}
      onClick={() => onClick(originalIdx, topic || 'Other', topicSetIndex || 0)}
      onMouseEnter={() => onHover(idx)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleSection}>
            <div className={styles.cardIndicator}></div>
            <h3 className={styles.cardTitle}>
              Vocabulary
            </h3>
          </div>
          {isCompleted && (
            <span className={styles.completedBadge}>
              ✓
            </span>
          )}
        </div>
        
        <div className={styles.cardInfo}>
          <div className={styles.infoItem}>
            <svg className={styles.infoIcon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className={`${styles.infoText} ${styles.primary}`}>{topic}</span>
          </div>
          <div className={styles.infoItem}>
            <svg className={styles.infoIcon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            <span className={`${styles.infoText} ${styles.secondary}`}>Set {topicSetIndex !== undefined ? topicSetIndex + 1 : originalIdx + 1}</span>
          </div>
          <div className={styles.infoItem}>
            <svg className={styles.infoIcon} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`${styles.infoText} ${styles.secondary}`}>Up to {WORDS_PER_SET} words</span>
          </div>
        </div>
        
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div 
              className={`${styles.progressFill} ${isCompleted ? styles.completed : styles.incomplete}`}
            ></div>
          </div>
          <p className={styles.progressText}>
            {isCompleted ? 'Completed' : 'Start'}
          </p>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <div className={styles.header}>
    <p className={styles.headerSubtitle}>Practice dictation with vocabulary</p>
    <div className={styles.headerFeatures}>
      <div className={styles.featureItem}>
        <svg className={styles.featureIcon} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z" clipRule="evenodd" />
        </svg>
        <span>Vocabulary practice</span>
      </div>
      <div className={styles.featureItem}>
        <svg className={styles.featureIcon} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Progress tracking</span>
      </div>
    </div>
  </div>
);

// Main component
const DictationList: React.FC = () => {
  const navigate = useNavigate();
  const { state, setHoverIdx } = useDictationListState();
  const { vocabSetsByTopic, isLoading, error, loadVocabularyData } = useVocabularyData();
  const { vocabCompletedSets, loadCompletedSets } = useCompletedSets();

  // Load data on mount
  useEffect(() => {
    loadVocabularyData();
    loadCompletedSets();
  }, [loadVocabularyData, loadCompletedSets]);

  // Simple logging for debugging
  useEffect(() => {
    if (vocabSetsByTopic.length > 0) {
      console.log(`DictationList: ${vocabSetsByTopic.length} topics loaded`);
      const topics = vocabSetsByTopic.map(t => t.topic);
      console.log('Topics:', topics);
    }
  }, [vocabSetsByTopic]);

  // Handle set click
  const handleSetClick = useCallback((originalIdx: number, topic: string, topicSetIndex: number) => {
    // Encode topic and set index in URL
    const encodedTopic = encodeURIComponent(topic);
    navigate(`/dictation/${originalIdx}?topic=${encodedTopic}&setIndex=${topicSetIndex}`);
  }, [navigate]);

  // Prepare all sets for rendering
  const getAllSets = useCallback((): VocabSet[] => {
    const allSets: VocabSet[] = [];
    
    if (!vocabSetsByTopic || vocabSetsByTopic.length === 0) {
      return allSets;
    }
    
    let globalSetIndex = 0;
    
    vocabSetsByTopic.forEach((topicData, topicIndex) => {
      if (topicData.sets && Array.isArray(topicData.sets)) {
        // Calculate how many sets we can create for this topic
        const topicVocabularyCount = topicData.sets.reduce((total, set) => {
          if (set && Array.isArray(set) && set.length > 0) {
            return total + set.length;
          }
          return total;
        }, 0);
        
        const setsForTopic = Math.ceil(topicVocabularyCount / WORDS_PER_SET);
        
        // Create sets for this topic
        for (let setIndex = 0; setIndex < setsForTopic; setIndex++) {
          allSets.push({
            set: [], // We'll load this dynamically
            idx: allSets.length,
            originalIdx: globalSetIndex,
            topic: topicData.topic || 'Other',
            topicSetIndex: setIndex // Add this to track set index within topic
          });
          
          globalSetIndex++;
        }
      }
    });    
    return allSets;
  }, [vocabSetsByTopic]);

  // Render content
  if (isLoading) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.contentContainer}>
          <Header />
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.contentContainer}>
          <Header />
          <ErrorMessage error={error} />
        </div>
      </div>
    );
  }

  const allSets = getAllSets();

  // Handle empty state
  if (allSets.length === 0 && !isLoading && !error) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.contentContainer}>
          <Header />
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>No Vocabulary Sets Available</h3>
            <p className={styles.emptyText}>There are no vocabulary sets available at the moment.</p>
            <button 
              onClick={() => loadVocabularyData()} 
              className={styles.refreshButton}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentContainer}>
        <Header />
        
        <div className={styles.vocabGrid}>
          {allSets.map((vocabSet) => (
            <VocabSetCard
              key={`vocab-${vocabSet.originalIdx}`}
              vocabSet={vocabSet}
              isCompleted={vocabCompletedSets.has(vocabSet.originalIdx)}
              isHovered={state.hoverIdx === vocabSet.idx}
              onHover={setHoverIdx}
              onClick={handleSetClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DictationList;