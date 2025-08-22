import React, { useState } from 'react';
import { Sentence } from '../../services/sentenceService';
import { TTSConfig } from '../../services/ttsService';
import { translationService } from '../../services/translationService';
import { ttsService } from '../../services/ttsService';
import styles from './SentenceForm.module.css';

interface SentenceFormProps {
  onSubmit: (sentence: Omit<Sentence, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  editingSentence?: Sentence | null;
  isLoading: boolean;
  ttsConfig: TTSConfig;
}

const SentenceForm: React.FC<SentenceFormProps> = ({
  onSubmit,
  onCancel,
  editingSentence,
  isLoading,
  ttsConfig
}) => {
  const [formData, setFormData] = useState<Omit<Sentence, 'id' | 'createdAt' | 'updatedAt'>>({
    englishSentence: editingSentence?.englishSentence || '',
    vietnameseTranslation: editingSentence?.vietnameseTranslation || '',
    audio: editingSentence?.audio || '',
    part: editingSentence?.part || 'part1'
  });

  const [audioError, setAudioError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.englishSentence.trim()) {
      setAudioError('Vui lòng nhập câu tiếng Anh');
      return;
    }

    setAudioError('');

    try {
      // Step 1: Auto translate
      console.log('Step 1: Auto translating...');
      const translationResult = await translationService.translateToVietnamese({
        englishSentence: formData.englishSentence
      });

      if (translationResult.error) {
        throw new Error(`Translation failed: ${translationResult.error}`);
      }

      // Step 2: Generate and upload audio
      console.log('Step 2: Generating audio...');
      const timestamp = Date.now();
      const filename = `sentence_${formData.part}_${timestamp}.mp3`;
      
      const audioUrl = await ttsService.generateAndUploadSentenceAudio(
        formData.englishSentence,
        filename,
        ttsConfig.voice
      );

      // Step 3: Prepare complete sentence data
      const completeSentence = {
        ...formData,
        vietnameseTranslation: translationResult.vietnameseTranslation,
        audio: audioUrl
      };

      console.log('Step 3: Saving to database...');
      await onSubmit(completeSentence);

    } catch (error) {
      console.error('Error in auto-generation process:', error);
      setAudioError(`Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (field: keyof Omit<Sentence, 'id' | 'createdAt' | 'updatedAt'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (field === 'englishSentence') {
      setAudioError('');
    }
  };



  const handlePartChange = (part: 'part1' | 'part2' | 'part3') => {
    setFormData(prev => ({ ...prev, part }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 className={styles.title}>
          {editingSentence ? 'Edit Sentence' : 'Create New Sentence'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Part Selection */}
        <div className={styles.partSelection}>
          <label className={styles.label}>Select Part *</label>
          <div className={styles.partButtons}>
            {(['part1', 'part2', 'part3'] as const).map((part) => (
              <button
                key={part}
                type="button"
                className={`${styles.partButton} ${formData.part === part ? styles.activePart : ''}`}
                onClick={() => handlePartChange(part as 'part1' | 'part2' | 'part3')}
              >
                {part.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* English Sentence */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            English Sentence *
          </label>
          <textarea
            value={formData.englishSentence}
            onChange={(e) => handleInputChange('englishSentence', e.target.value)}
            rows={3}
            className={styles.textarea}
            placeholder="Enter English sentence..."
            required
          />
        </div>

        {/* Error Display */}
        {audioError && (
          <div className={styles.errorMessage}>{audioError}</div>
        )}

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Đang tạo...' : editingSentence ? 'Update' : 'Tạo Sentence'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SentenceForm;
