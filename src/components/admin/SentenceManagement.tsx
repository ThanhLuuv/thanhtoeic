import React, { useState } from 'react';
import SentenceForm from './SentenceForm';
import SentenceList from './SentenceList';
import { Sentence } from '../../services/sentenceService';
import { sentenceService } from '../../services/sentenceService';
import { TTSConfig } from '../../services/ttsService';
import styles from './SentenceManagement.module.css';

interface SentenceManagementProps {
  ttsConfig: TTSConfig;
}

const SentenceManagement: React.FC<SentenceManagementProps> = ({ ttsConfig }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSentence, setEditingSentence] = useState<Sentence | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSentenceId, setEditingSentenceId] = useState<string | null>(null);

  const handleCreateSentence = async (sentenceData: Omit<Sentence, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      await sentenceService.createSentence(sentenceData);
      setShowForm(false);
      setEditingSentence(null);
      // Refresh the list by triggering a re-render
      setEditingSentenceId('temp-' + Date.now());
    } catch (error) {
      console.error('Error creating sentence:', error);
      alert('Failed to create sentence. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSentence = async (sentenceData: Omit<Sentence, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingSentence?.id) return;
    
    try {
      setIsLoading(true);
      await sentenceService.updateSentence(editingSentence.id, sentenceData);
      setShowForm(false);
      setEditingSentence(null);
      setEditingSentenceId(null);
      // Refresh the list
      setEditingSentenceId('temp-' + Date.now());
    } catch (error) {
      console.error('Error updating sentence:', error);
      alert('Failed to update sentence. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (sentence: Sentence) => {
    setEditingSentence(sentence);
    setEditingSentenceId(sentence.id || null);
    setShowForm(true);
  };

  const handleDelete = async (sentenceId: string) => {
    try {
      await sentenceService.deleteSentence(sentenceId);
      // Refresh the list
      setEditingSentenceId('temp-' + Date.now());
    } catch (error) {
      console.error('Error deleting sentence:', error);
      alert('Failed to delete sentence. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSentence(null);
    setEditingSentenceId(null);
  };

  const handleSubmit = editingSentence 
    ? handleUpdateSentence 
    : handleCreateSentence;

  return (
    <div className={styles.container}>
      {showForm && (
        <div className={styles.formContainer}>
          <SentenceForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editingSentence={editingSentence}
            isLoading={isLoading}
            ttsConfig={ttsConfig}
          />
        </div>
      )}

      <SentenceList
        onEdit={handleEdit}
        onDelete={handleDelete}
        editingSentenceId={editingSentenceId}
      />
    </div>
  );
};

export default SentenceManagement;
