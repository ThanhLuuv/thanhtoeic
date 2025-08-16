import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { vocabularyService, ToeicVocabulary, VocabSetByTopic } from '../services';

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
  <div className="text-center py-20">
      <h3 className="text-2xl font-bold text-gray-800 mb-3">Loading...</h3>
  </div>
);

const ErrorMessage: React.FC<{ error: string }> = ({ error }) => (
  <div className="text-center py-20">
      <h3 className="text-xl font-bold text-gray-800 mb-3">Error</h3>
      <p className="text-gray-600">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 bg-[#00CCFF] text-white px-4 py-2 rounded-lg hover:bg-[#0099CC]"
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
      className={`
        relative rounded-xl p-5 cursor-pointer transition-all duration-300 transform bg-white shadow-lg
        ${isHovered 
          ? 'shadow-xl scale-105 -translate-y-1' 
          : 'hover:shadow-xl'
        }
      `}
      onClick={() => onClick(originalIdx, topic || 'Other', topicSetIndex || 0)}
      onMouseEnter={() => onHover(idx)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: '#00CCFF' }}
            ></div>
            <h3 className="text-lg font-bold text-slate-800">
              Set {topicSetIndex !== undefined ? topicSetIndex + 1 : originalIdx + 1}
            </h3>
          </div>
          {isCompleted && (
            <span className="bg-[#00CCFF] text-white text-xs px-2 py-1 rounded-full font-bold">
              ✓
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="text-slate-700 font-medium">{topic}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            <span className="text-slate-600">Set {topicSetIndex !== undefined ? topicSetIndex + 1 : originalIdx + 1}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-slate-600">Up to {WORDS_PER_SET} words</span>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="w-full bg-slate-100 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-[#00CCFF] w-full' : 'bg-[#00CCFF] w-0'
              }`}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-1 text-center">
            {isCompleted ? 'Completed' : 'Start'}
          </p>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <div className="text-center mb-4">
    <p className="text-slate-600 text-lg">Practice dictation with vocabulary</p>
    <div className="mt-4 flex justify-center items-center gap-4 text-sm text-slate-500">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z" clipRule="evenodd" />
        </svg>
        <span>Vocabulary practice</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
        
        console.log(`[DictationList] Topic "${topicData.topic}": ${topicVocabularyCount} words, ${setsForTopic} sets`);
        
        // Create sets for this topic
        for (let setIndex = 0; setIndex < setsForTopic; setIndex++) {
          allSets.push({
            set: [], // We'll load this dynamically
            idx: allSets.length,
            originalIdx: globalSetIndex,
            topic: topicData.topic || 'Other',
            topicSetIndex: setIndex // Add this to track set index within topic
          });
          
          console.log(`[DictationList] Created set:`, {
            topic: topicData.topic || 'Other',
            topicSetIndex: setIndex,
            globalSetIndex,
            topicVocabularyCount,
            setsForTopic
          });
          
          globalSetIndex++;
        }
      }
    });
    
    console.log(`[DictationList] Total sets created:`, allSets.length);
    console.log(`[DictationList] All sets:`, allSets.map(s => ({
      originalIdx: s.originalIdx,
      topic: s.topic,
      topicSetIndex: s.topicSetIndex,
      globalSetIndex: s.originalIdx
    })));
    
    return allSets;
  }, [vocabSetsByTopic]);

  // Render content
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <Header />
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
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
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <Header />
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Vocabulary Sets Available</h3>
            <p className="text-gray-600 mb-4">There are no vocabulary sets available at the moment.</p>
            <button 
              onClick={() => loadVocabularyData()} 
              className="bg-[#00CCFF] text-white px-4 py-2 rounded-lg hover:bg-[#0099CC]"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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