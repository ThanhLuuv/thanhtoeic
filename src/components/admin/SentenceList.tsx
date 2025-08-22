import React, { useState, useEffect } from 'react';
import { Sentence } from '../../services/sentenceService';
import { sentenceService } from '../../services/sentenceService';
import styles from './SentenceList.module.css';

interface SentenceListProps {
  onEdit: (sentence: Sentence) => void;
  onDelete: (sentenceId: string) => void;
  editingSentenceId: string | null;
}

const SentenceList: React.FC<SentenceListProps> = ({
  onEdit,
  onDelete,
  editingSentenceId
}) => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<'all' | 'part1' | 'part2' | 'part3' | 'part4'>('all');
  const [countByPart, setCountByPart] = useState<Record<string, number>>({
    part1: 0,
    part2: 0,
    part3: 0,
    part4: 0
  });

  useEffect(() => {
    loadSentences();
    loadCountByPart();
  }, []);

  const loadSentences = async () => {
    try {
      setLoading(true);
      const allSentences = await sentenceService.getSentences();
      setSentences(allSentences);
      setError('');
    } catch (err) {
      setError('Failed to load sentences');
      console.error('Error loading sentences:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCountByPart = async () => {
    try {
      const counts = await sentenceService.getSentenceCountByPart();
      setCountByPart(counts);
    } catch (err) {
      console.error('Error loading counts:', err);
    }
  };

  const handleDelete = async (sentenceId: string) => {
    if (window.confirm('Are you sure you want to delete this sentence?')) {
      try {
        await sentenceService.deleteSentence(sentenceId);
        await loadSentences();
        await loadCountByPart();
      } catch (err) {
        setError('Failed to delete sentence');
        console.error('Error deleting sentence:', err);
      }
    }
  };

  const filteredSentences = selectedPart === 'all' 
    ? sentences 
    : sentences.filter(s => s.part === selectedPart);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading sentences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={loadSentences} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Part Filter */}
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Filter by Part:</label>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${selectedPart === 'all' ? styles.activeFilter : ''}`}
            onClick={() => setSelectedPart('all')}
          >
            All ({sentences.length})
          </button>
          {(['part1', 'part2', 'part3', 'part4'] as const).map((part) => (
            <button
              key={part}
              className={`${styles.filterButton} ${selectedPart === part ? styles.activeFilter : ''}`}
              onClick={() => setSelectedPart(part)}
            >
              {part.toUpperCase()} ({countByPart[part]})
            </button>
          ))}
        </div>
      </div>

      {/* Sentences List */}
      <div className={styles.sentencesContainer}>
        {filteredSentences.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No sentences found for {selectedPart === 'all' ? 'any part' : selectedPart}.</p>
          </div>
        ) : (
          filteredSentences.map((sentence) => (
            <div key={sentence.id} className={styles.sentenceCard}>
              <div className={styles.sentenceHeader}>
                <div className={styles.sentenceInfo}>
                  <span className={`${styles.partBadge} ${styles[`part${sentence.part.slice(-1)}`]}`}>
                    {sentence.part.toUpperCase()}
                  </span>
                  <span className={styles.date}>
                    {sentence.createdAt ? formatDate(sentence.createdAt) : 'Unknown date'}
                  </span>
                </div>
                <div className={styles.actions}>
                  <button
                    onClick={() => onEdit(sentence)}
                    disabled={editingSentenceId === sentence.id}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sentence.id!)}
                    disabled={editingSentenceId === sentence.id}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className={styles.sentenceContent}>
                <div className={styles.englishSentence}>
                  <strong>English:</strong> {sentence.englishSentence}
                </div>
                <div className={styles.vietnameseTranslation}>
                  <strong>Vietnamese:</strong> {sentence.vietnameseTranslation}
                </div>
                {sentence.audio && (
                  <div className={styles.audioSection}>
                    <strong>Audio:</strong>
                    <audio controls className={styles.audioPlayer}>
                      <source src={sentence.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SentenceList;
