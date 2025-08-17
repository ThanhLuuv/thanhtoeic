import React, { useState } from 'react';
import { Vocabulary } from '../../services/adminService';
import { TTSConfig } from '../../services/ttsService';
import styles from './VocabularyForm.module.css';

interface VocabularyFormProps {
  topics: Array<{ id: string; name: string }>;
  onSubmit: (vocab: Vocabulary) => Promise<void>;
  onCancel: () => void;
  editingVocab?: Vocabulary | null;
  isLoading: boolean;
  ttsConfig: TTSConfig;
}

const VocabularyForm: React.FC<VocabularyFormProps> = ({
  topics,
  onSubmit,
  onCancel,
  editingVocab,
  isLoading,
  ttsConfig
}) => {
  const [formData, setFormData] = useState<Vocabulary>({
    word: editingVocab?.word || '',
    type: editingVocab?.type || '',
    meaning: editingVocab?.meaning || '',
    topicId: editingVocab?.topicId || '',
    phonetic: editingVocab?.phonetic || '',
    audio: editingVocab?.audio || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof Vocabulary, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className={styles.title}>
          {editingVocab ? 'Edit Vocabulary' : 'Create New Vocabulary'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Word *
            </label>
            <input
              type="text"
              value={formData.word}
              onChange={(e) => handleInputChange('word', e.target.value)}
              className={styles.input}
              placeholder="Enter English word"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className={styles.select}
              required
            >
              <option value="">Select type</option>
              <option value="n.">Noun (n.)</option>
              <option value="v.">Verb (v.)</option>
              <option value="adj.">Adjective (adj.)</option>
              <option value="adv.">Adverb (adv.)</option>
              <option value="prep.">Preposition (prep.)</option>
              <option value="conj.">Conjunction (conj.)</option>
              <option value="phr.">Phrase (phr.)</option>
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Topic *
            </label>
            <select
              value={formData.topicId}
              onChange={(e) => handleInputChange('topicId', e.target.value)}
              className={styles.select}
              required
            >
              <option value="">Select a topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Phonetic (optional)
            </label>
            <input
              type="text"
              value={formData.phonetic}
              onChange={(e) => handleInputChange('phonetic', e.target.value)}
              className={styles.input}
              placeholder="/əˈraɪvəl/"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Meaning *
          </label>
          <textarea
            value={formData.meaning}
            onChange={(e) => handleInputChange('meaning', e.target.value)}
            rows={2}
            className={styles.textarea}
            placeholder="Enter meaning in Vietnamese"
            required
          />
        </div>

        {!editingVocab && (
          <div className={styles.autoAudioNote}>
            <p className={styles.autoAudioText}>
              <strong>Auto Audio:</strong> Audio sẽ được tự động tạo bằng Google TTS với giọng {ttsConfig.voice} và tốc độ {ttsConfig.speakingRate}x
            </p>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Creating...' : editingVocab ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VocabularyForm;
