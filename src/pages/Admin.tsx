import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminService, Topic, Vocabulary } from '../services/adminService';
import { ttsService, TTSConfig, defaultTTSConfig } from '../services/ttsService';
import TTSSettings from '../components/admin/TTSSettings';
import styles from './Admin.module.css';



const Admin: React.FC = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'topics' | 'vocabulary'>('topics');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editingVocab, setEditingVocab] = useState<Vocabulary | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('');
  const [showDeleteTopicModal, setShowDeleteTopicModal] = useState(false);
  const [showDeleteVocabModal, setShowDeleteVocabModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'topic' | 'vocabulary' } | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string; visible: boolean } | null>(null);
  const [ttsConfig, setTTSConfig] = useState<TTSConfig>(defaultTTSConfig);
  const wordInputRef = useRef<HTMLInputElement>(null);

  // Topic form state
  const [topicForm, setTopicForm] = useState<Topic>({
    name: '',
    description: '',
    category: '',
    difficulty: 'intermediate',
    isActive: true
  });

  // Vocabulary form state
  const [vocabForm, setVocabForm] = useState<Vocabulary>({
    word: '',
    type: '',
    meaning: '',
    topicId: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Check if user is admin - more flexible approach
    // You can modify this logic based on your needs
    const isAdmin = currentUser.email === 'admin@example.com' || 
                   currentUser.email?.includes('admin') ||
                   currentUser.role === 'admin' ||
                   currentUser.id === 'admin'; // Add your admin ID here
    
    if (!isAdmin) {
      // Instead of redirecting to home, show access denied message
      setToast({ type: 'error', text: 'Access denied. Admin privileges required.', visible: true });
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }
    
    loadTopics();
    loadVocabularies();
  }, [currentUser, navigate]);

  // Simple logging for debugging
  useEffect(() => {
    if (topics.length > 0 && vocabularies.length > 0) {
    }
  }, [topics, vocabularies]);

  const loadTopics = async () => {
    try {
      const topicsData = await adminService.getTopics();
      setTopics(topicsData);
    } catch (error) {
      console.error('Error loading topics:', error);
      setToast({ type: 'error', text: 'Failed to load topics', visible: true });
    }
  };

  const loadVocabularies = async () => {
    try {
      const vocabData = await adminService.getVocabularies();
      setVocabularies(vocabData);
    } catch (error) {
      console.error('Error loading vocabularies:', error);
      setToast({ type: 'error', text: 'Failed to load vocabularies', visible: true });
    }
  };

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const topicId = await adminService.createTopic(topicForm);
      const newTopic = { ...topicForm, id: topicId };
      setTopics(prev => [newTopic, ...prev]);
      
      setTopicForm({
        name: '',
        description: '',
        category: '',
        difficulty: 'intermediate',
        isActive: true
      });
      
      setToast({ type: 'success', text: 'Topic created successfully!', visible: true });
      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
    } catch (error) {
      setToast({ type: 'error', text: 'Failed to create topic', visible: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVocabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create vocabulary first (without audio, it will be generated automatically)
      const vocabId = await adminService.createVocabulary(vocabForm);
      const newVocab = { ...vocabForm, id: vocabId, audio: '' };
      
      // Show success message
      setToast({ type: 'success', text: 'Vocabulary created successfully!', visible: true });
      setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
      
      // Generate and upload audio
      try {
        setToast({ type: 'success', text: 'Generating audio...', visible: true });
        const audioUrl = await ttsService.generateAndUploadAudio(
          vocabForm.word,
          `${vocabForm.word.toLowerCase().replace(/\s+/g, '_')}.mp3`,
          ttsConfig
        );
        
        // Update vocabulary with audio URL
        await adminService.updateVocabulary(vocabId, { ...newVocab, audio: audioUrl });
        newVocab.audio = audioUrl;
        
        setToast({ type: 'success', text: 'Audio generated and uploaded successfully!', visible: true });
        setTimeout(() => {
          setToast(prev => prev ? { ...prev, visible: false } : null);
        }, 3000);
      } catch (audioError) {
        console.error('Audio generation error:', audioError);
        setToast({ type: 'error', text: 'Vocabulary created but audio generation failed', visible: true });
        setTimeout(() => {
          setToast(prev => prev ? { ...prev, visible: false } : null);
        }, 3000);
      }
      
      // Update local state
      setVocabularies(prev => [newVocab, ...prev]);
      
      // Reset form but keep the selected topic
      setVocabForm({
        word: '',
        type: '',
        meaning: '',
        topicId: vocabForm.topicId // Keep the selected topic
      });
      
      // Focus back to word input for quick entry
      setTimeout(() => {
        wordInputRef.current?.focus();
      }, 100);
      
    } catch (error) {
      setToast({ type: 'error', text: 'Failed to create vocabulary', visible: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setTopicForm(topic);
  };

  const handleCancelEditTopic = () => {
    setEditingTopic(null);
    setTopicForm({
      name: '',
      description: '',
      category: '',
      difficulty: 'intermediate',
      isActive: true
    });
  };

  const handleUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic?.id) return;
    
    setIsLoading(true);
    try {
      await adminService.updateTopic(editingTopic.id, topicForm);
      setTopics(prev => prev.map(t => t.id === editingTopic.id ? { ...topicForm, id: editingTopic.id } : t));
      
      setEditingTopic(null);
      setTopicForm({
        name: '',
        description: '',
        category: '',
        difficulty: 'intermediate',
        isActive: true
      });
      
      setToast({ type: 'success', text: 'Topic updated successfully!', visible: true });
      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
    } catch (error) {
      setToast({ type: 'error', text: 'Failed to update topic', visible: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
      setItemToDelete({ id: topicId, name: topic.name, type: 'topic' });
      setShowDeleteTopicModal(true);
    }
  };

  const confirmDeleteTopic = async () => {
    if (!itemToDelete) return;
    
    try {
      await adminService.deleteTopic(itemToDelete.id);
      setTopics(prev => prev.filter(t => t.id !== itemToDelete.id));
      setVocabularies(prev => prev.filter(v => v.topicId !== itemToDelete.id));
      setToast({ type: 'success', text: 'Topic deleted successfully!', visible: true });
      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
    } catch (error) {
      setToast({ type: 'error', text: 'Failed to delete topic', visible: true });
    } finally {
      setShowDeleteTopicModal(false);
      setItemToDelete(null);
    }
  };

  const handleEditVocab = (vocab: Vocabulary) => {
    setEditingVocab(vocab);
    setVocabForm({
      word: vocab.word,
      type: vocab.type,
      meaning: vocab.meaning,
      topicId: vocab.topicId
    });
  };

  const handleCancelEditVocab = () => {
    setEditingVocab(null);
    setVocabForm({
      word: '',
      type: '',
      meaning: '',
      topicId: ''
    });
  };

  const handleUpdateVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVocab?.id) return;
    
    setIsLoading(true);
    try {
      await adminService.updateVocabulary(editingVocab.id, vocabForm);
      setVocabularies(prev => prev.map(v => v.id === editingVocab.id ? { ...vocabForm, id: editingVocab.id, audio: v.audio } : v));
      
      setEditingVocab(null);
      setVocabForm({
        word: '',
        type: '',
        meaning: '',
        topicId: ''
      });
      
      setToast({ type: 'success', text: 'Vocabulary updated successfully!', visible: true });
      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
    } catch (error) {
      setToast({ type: 'error', text: 'Failed to update vocabulary', visible: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVocab = async (vocabId: string) => {
    const vocab = vocabularies.find(v => v.id === vocabId);
    if (vocab) {
      setItemToDelete({ id: vocabId, name: vocab.word, type: 'vocabulary' });
      setShowDeleteVocabModal(true);
    }
  };

  const confirmDeleteVocab = async () => {
    if (!itemToDelete) return;
    
    try {
      await adminService.deleteVocabulary(itemToDelete.id);
      setVocabularies(prev => prev.filter(v => v.id !== itemToDelete.id));
      setToast({ type: 'success', text: 'Vocabulary deleted successfully!', visible: true });
      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
    } catch (error) {
      setToast({ type: 'error', text: 'Failed to delete vocabulary', visible: true });
    } finally {
      setShowDeleteVocabModal(false);
      setItemToDelete(null);
    }
  };

  // Filter and search vocabulary
  const filteredVocabularies = vocabularies.filter(vocab => {
    const matchesSearch = searchTerm === '' || 
      (vocab.word && vocab.word.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vocab.meaning && vocab.meaning.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vocab.type && vocab.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vocab.phonetic && vocab.phonetic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTopic = selectedTopicFilter === '' || vocab.topicId === selectedTopicFilter;
    
    return matchesSearch && matchesTopic;
  });

  const handleImportFromDataJson = async () => {
    if (topics.length === 0) {
      setToast({ type: 'error', text: 'Please create at least one topic before importing vocabulary.', visible: true });
      return;
    }

    setIsLoading(true);
    try {
      // Fetch data.json
      const response = await fetch('/data.json');
      const data = await response.json();
      
      // Map data to vocabulary format
      const vocabList = data.map((item: any) => ({
        word: item.word,
        type: item.type,
        meaning: item.meaning,
        audio: '', // Audio will be generated automatically
        topicId: topics[0].id // Assign to first topic for now
      }));

      // Create vocabularies in batches
      const batchSize = 50;
      const results = [];
      
      for (let i = 0; i < vocabList.length; i += batchSize) {
        const batch = vocabList.slice(i, i + batchSize);
        const batchResults = await adminService.createMultipleVocabularies(batch);
        results.push(...batchResults);
      }

      setToast({ 
        type: 'success', 
        text: `Successfully imported ${results.length} vocabulary items!`,
        visible: true
      });
      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
      
      // Reload vocabularies
      await loadVocabularies();
      setShowImportModal(false);
      
    } catch (error) {
      console.error('Import error:', error);
      setToast({ type: 'error', text: 'Failed to import vocabulary from data.json', visible: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setIsLoading(true);
      
      // Prepare export data
      const exportData = {
        exportDate: new Date().toISOString(),
        topics: topics.map(topic => ({
          id: topic.id,
          name: topic.name,
          description: topic.description,
          category: topic.category,
          difficulty: topic.difficulty,
          isActive: topic.isActive
        })),
        vocabulary: vocabularies.map(vocab => ({
          id: vocab.id,
          word: vocab.word,
          type: vocab.type,
          meaning: vocab.meaning,
          phonetic: vocab.phonetic,
          audio: vocab.audio,
          topicId: vocab.topicId,
          topicName: topics.find(t => t.id === vocab.topicId)?.name || 'Unknown Topic'
        }))
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `firebase-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      setToast({ 
        type: 'success', 
        text: `Successfully exported ${exportData.topics.length} topics and ${exportData.vocabulary.length} vocabulary items!`,
        visible: true
      });
      
      setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
      
    } catch (error) {
      console.error('Export error:', error);
      setToast({ type: 'error', text: 'Failed to export data', visible: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.loadingTitle}>Loading...</h2>
          <p className={styles.loadingText}>Checking authentication status...</p>
        </div>
      </div>
    );
  }

  // Show access denied if no user
  if (!currentUser) {
    return (
      <div className={styles.accessDeniedContainer}>
        <div className={styles.accessDeniedContent}>
          <div className={styles.accessDeniedIcon}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className={styles.accessDeniedTitle}>Access Denied</h2>
          <p className={styles.accessDeniedText}>No user logged in</p>
          <button 
            onClick={() => navigate('/login')} 
            className={styles.loginButton}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-slate-50">
             {/* Header */}
       <div className={styles.adminHeader}>
         <div className={styles.adminHeaderContent}>
           <div className={styles.adminHeaderInner}>
             <div className={styles.adminLogo}>
               <div className={styles.adminLogoIcon}>
                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <h1 className={styles.adminTitle}>Admin Dashboard</h1>
             </div>
             <div className={styles.adminUserInfo}>
               <div className={styles.userWelcome}>
                 <span className={styles.userWelcomeText}>Welcome, {currentUser.email}</span>
               </div>
               <button
                 onClick={handleLogout}
                 className={styles.logoutButton}
               >
                 Logout
               </button>
             </div>
          </div>
        </div>
      </div>

             {/* Main Content */}
       <div className={styles.mainContent}>
                 {/* Tabs */}
         <div className={styles.tabsContainer}>
                     <nav className={styles.tabsNav}>
             <div
               onClick={() => setActiveTab('topics')}
               className={`${styles.tabButton} ${activeTab === 'topics' ? styles.active : ''}`}
             >
               <div>
                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
                 <span>Topics</span>
               </div>
             </div>
             <div
               onClick={() => setActiveTab('vocabulary')}
               className={`${styles.tabButton} ${activeTab === 'vocabulary' ? styles.active : ''}`}
             >
               <div>
                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                 </svg>
                 <span>Vocabulary</span>
               </div>
             </div>
           </nav>
          
        </div>
        

                 {/* Toast Notification */}
         {toast && toast.visible && (
           <div className={`${styles.toast} ${toast.type === 'success' ? styles.success : styles.error}`}>
             <div className={styles.toastContent}>
               {toast.type === 'success' ? (
                 <svg className={`${styles.toastIcon} ${styles.success}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               ) : (
                 <svg className={`${styles.toastIcon} ${styles.error}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               )}
               <span className={styles.toastText}>{toast.text}</span>
               <button
                 onClick={() => setToast(prev => prev ? { ...prev, visible: false } : null)}
                 className={styles.toastClose}
               >
                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
           </div>
         )}

                 {/* Topics Tab */}
         {activeTab === 'topics' && (
           <div className="space-y-4">
             <div className={styles.formContainer}>
              <div className={styles.formHeader}>
                <div className={`${styles.formHeaderIcon} ${styles.topics}`}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className={styles.formTitle}>
                  {editingTopic ? 'Edit Topic' : 'Create New Topic'}
                </h2>
              </div>
                             <form onSubmit={editingTopic ? handleUpdateTopic : handleTopicSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                                         <label className={styles.formLabel}>
                       Topic Name
                     </label>
                     <input
                       type="text"
                       value={topicForm.name}
                       onChange={(e) => setTopicForm(prev => ({ ...prev, name: e.target.value }))}
                       className={styles.formInput}
                       required
                     />
                  </div>
                  <div className={styles.formField}>
                                         <label className={styles.formLabel}>
                       Category
                     </label>
                     <select
                       value={topicForm.category}
                       onChange={(e) => setTopicForm(prev => ({ ...prev, category: e.target.value }))}
                       className={styles.formSelect}
                       required
                     >
                       <option value="">Select a category</option>
                       <option value="Business">Business</option>
                       <option value="Education">Education</option>
                       <option value="Technology">Technology</option>
                       <option value="Health">Health</option>
                       <option value="Travel">Travel</option>
                       <option value="Food">Food</option>
                       <option value="Sports">Sports</option>
                       <option value="Entertainment">Entertainment</option>
                       <option value="Science">Science</option>
                       <option value="Other">Other</option>
                     </select>
                  </div>
                </div>
                                 <div className={styles.formField}>
                   <label className={styles.formLabel}>
                     Description
                   </label>
                   <textarea
                     value={topicForm.description}
                     onChange={(e) => setTopicForm(prev => ({ ...prev, description: e.target.value }))}
                     rows={2}
                     className={styles.formTextarea}
                     required
                   />
                 </div>
                
                                 <div className={styles.formButtons}>
                   <button
                     type="submit"
                     disabled={isLoading}
                     className={styles.submitButton}
                   >
                     {isLoading ? 'Creating...' : editingTopic ? 'Update' : 'Create'}
                   </button>
                   {editingTopic && (
                     <button
                       type="button"
                       onClick={handleCancelEditTopic}
                       className={styles.cancelButton}
                     >
                       Cancel
                     </button>
                   )}
                 </div>
              </form>
            </div>

                         {/* Topics List */}
             <div className={styles.listContainer}>
                               <div className={styles.listHeader}>
                  <div className={styles.listHeaderContent}>
                    <h3 className={styles.listTitle}>Existing Topics</h3>
                    <span className={styles.listCount}>{topics.length} topics</span>
                  </div>
                </div>
                <div className={styles.listGrid}>
                {topics.map((topic) => (
                                     <div key={topic.id} className={styles.listItem}>
                     <div className={styles.itemContent}>
                       <div className={styles.itemHeader}>
                         <h4 className={styles.itemTitle}>{topic.name}</h4>
                         <div className={styles.itemActions}>
                           <button
                             onClick={() => handleEditTopic(topic)}
                             className={`${styles.actionButton} ${styles.editButton}`}
                           >
                             Edit
                           </button>
                           <button
                             onClick={() => handleDeleteTopic(topic.id!)}
                             className={`${styles.actionButton} ${styles.deleteButton}`}
                           >
                             Delete
                           </button>
                         </div>
                       </div>
                       <p className={styles.itemDescription}>{topic.description}</p>
                                                <div className={styles.itemTags}>
                           <span className={`${styles.itemTag} ${styles.category}`}>
                             {topic.category}
                           </span>
                         </div>
                     </div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        )}

                 {/* Vocabulary Tab */}
         {activeTab === 'vocabulary' && (
           <div className="space-y-4">
             {/* TTS Settings */}
             <TTSSettings config={ttsConfig} onConfigChange={setTTSConfig} />
             <div className={styles.formContainer}>
                             <div className={styles.formHeader}>
                 <div className={`${styles.formHeaderIcon} ${styles.vocabulary}`}>
                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                   </svg>
                 </div>
                 <h2 className={styles.formTitle}>
                   {editingVocab ? 'Edit Vocabulary' : 'Create New Vocabulary'}
                 </h2>
               </div>
                             <form onSubmit={editingVocab ? handleUpdateVocab : handleVocabSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                                    <div className={styles.formField}>
                    <label className={styles.formLabel}>
                      Word
                    </label>
                    <input
                      ref={wordInputRef}
                      type="text"
                      value={vocabForm.word}
                      onChange={(e) => setVocabForm(prev => ({ ...prev, word: e.target.value }))}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>
                      Type
                    </label>
                                         <input
                       type="text"
                       value={vocabForm.type}
                       onChange={(e) => setVocabForm(prev => ({ ...prev, type: e.target.value }))}
                       placeholder="n., v., adj., etc."
                       className={styles.formInput}
                       required
                     />
                  </div>
                </div>
                                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Meaning
                  </label>
                  <input
                    type="text"
                    value={vocabForm.meaning}
                    onChange={(e) => setVocabForm(prev => ({ ...prev, meaning: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !editingVocab) {
                        e.preventDefault();
                        handleVocabSubmit(e);
                      }
                    }}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Topic
                  </label>
                  <select
                    value={vocabForm.topicId}
                    onChange={(e) => setVocabForm(prev => ({ ...prev, topicId: e.target.value }))}
                    className={styles.formSelect}
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
                

                  <div className={styles.formButtons}>
                   <button
                     type="submit"
                     disabled={isLoading}
                     className={styles.submitButton}
                   >
                     {isLoading ? 'Creating...' : editingVocab ? 'Update' : 'Create'}
                   </button>
                   {editingVocab && (
                     <button
                       type="button"
                       onClick={handleCancelEditVocab}
                       className={styles.cancelButton}
                     >
                       Cancel
                     </button>
                   )}
                 </div>
              </form>
            </div>

             {/* Search and Filter Controls */}
             <div className={styles.controlsContainer}>
               <div className={styles.controlsGrid}>
                 {/* Search Input */}
                 <div className={styles.searchContainer}>
                   <label className={styles.formLabel}>
                     Search
                   </label>
                   <div className={styles.searchContainer}>
                     <input
                       type="text"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       placeholder="Search by word, meaning, type..."
                       className={styles.searchInput}
                     />
                     <div className={styles.searchIcon}>
                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                       </svg>
                     </div>
                   </div>
                 </div>
                 
                 {/* Topic Filter */}
                 <div className={styles.formField}>
                   <label className={styles.formLabel}>
                     Filter by topic
                   </label>
                                        <select
                       value={selectedTopicFilter}
                       onChange={(e) => setSelectedTopicFilter(e.target.value)}
                       className={styles.formSelect}
                     >
                     <option value="">All topics</option>
                     {topics.map((topic) => (
                       <option key={topic.id} value={topic.id}>
                         {topic.name}
                       </option>
                     ))}
                   </select>
                 </div>
                 
                 {/* Import and Export Buttons */}
                 <div className="flex items-end gap-2">
                   <button
                     onClick={handleExportData}
                     disabled={isLoading}
                     className={styles.exportButton}
                   >
                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     <span>Export</span>
                   </button>
                   <button
                     onClick={() => setShowImportModal(true)}
                     className={styles.importButton}
                   >
                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                     </svg>
                     <span>Import</span>
                   </button>
                 </div>
               </div>
               
               {/* Results Count */}
               <div className={styles.resultsCount}>
                 <p className={styles.resultsCountText}>
                   Display <span className={`${styles.resultsCountHighlight} ${styles.success}`}>{filteredVocabularies.length}</span> 
                    { } in total <span className={`${styles.resultsCountHighlight} ${styles.neutral}`}>{vocabularies.length}</span> vocabulary
                 </p>
               </div>
             </div>

             {/* Vocabulary List */}
             <div className={styles.listContainer}>
                <div className={styles.listHeader}>
                   <div className={styles.listHeaderContent}>
                     <h3 className={styles.listTitle}>Existing Vocabulary</h3>
                     <span className={styles.listCount}>{filteredVocabularies.length} items</span>
                   </div>
                 </div>
                 <div className={styles.listGrid}>
                 {filteredVocabularies.map((vocab) => (
                                     <div key={vocab.id} className={styles.listItem}>
                     <div className={styles.itemContent}>
                       <div className={styles.itemHeader}>
                         <div>
                           <h4 className={styles.itemTitle}>{vocab.word}</h4>
                           {vocab.audio ? (
                             <span className={`${styles.itemTag} ${styles.audio}`}>
                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                               </svg>
                               Audio
                             </span>
                           ) : (
                             <span className={`${styles.itemTag} ${styles.noAudio}`}>
                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                               No Audio
                             </span>
                           )}
                         </div>
                         <div className={styles.itemActions}>
                           <button
                             onClick={() => handleEditVocab(vocab)}
                             className={`${styles.actionButton} ${styles.editButton}`}
                           >
                             Edit
                           </button>
                           <button
                             onClick={() => handleDeleteVocab(vocab.id!)}
                             className={`${styles.actionButton} ${styles.deleteButton}`}
                           >
                             Delete
                           </button>
                         </div>
                       </div>
                       <p className={styles.itemDescription}>{vocab.meaning}</p>
                       <div className={styles.itemFooter}>
                         <div className={styles.itemTags}>
                           <span className={`${styles.itemTag} ${styles.type}`}>{vocab.type}</span>
                           <span className={`${styles.itemTag} ${styles.phonetic}`}>{vocab.phonetic}</span>
                           <span className={`${styles.itemTag} ${styles.topic}`}>
                             {topics.find(t => t.id === vocab.topicId)?.name || 'Unknown Topic'}
                           </span>
                         </div>
                         {vocab.audio && (
                           <button
                             onClick={() => {
                               const audio = new Audio(vocab.audio);
                               audio.play();
                             }}
                             className={styles.playButton}
                           >
                             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                             </svg>
                             <span>Nghe</span>
                           </button>
                         )}
                       </div>
                     </div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        )}

                 {/* Import Modal */}
         {showImportModal && (
           <div className={styles.modalOverlay}>
             <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <div className={`${styles.modalIcon} ${styles.import}`}>
                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                   </svg>
                 </div>
                 <h3 className={styles.modalTitle}>Import Vocabulary</h3>
                 <p className={styles.modalText}>
                   This will import all vocabulary from the data.json file. Make sure you have created the necessary topics first.
                 </p>
                <div className={styles.modalButtons}>
                                     <button
                     onClick={() => setShowImportModal(false)}
                     className={styles.cancelButton}
                   >
                     Cancel
                   </button>
                   <button
                     onClick={handleImportFromDataJson}
                     disabled={isLoading}
                     className={styles.submitButton}
                   >
                     {isLoading ? 'Importing...' : 'Import'}
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

         {/* Delete Topic Confirmation Modal */}
         {showDeleteTopicModal && (
           <div className={styles.modalOverlay}>
             <div className={styles.modal}>
               <div className={styles.modalHeader}>
                 <div className={`${styles.modalIcon} ${styles.error}`}>
                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                   </svg>
                 </div>
                 <h3 className={styles.modalTitle}>Delete Topic</h3>
                 <p className={styles.modalText}>
                   Are you sure you want to delete <span className={`${styles.modalHighlight} ${styles.error}`}>"{itemToDelete?.name}"</span>? 
                   This will also delete all associated vocabulary.
                 </p>
                 <div className={styles.modalButtons}>
                   <button
                     onClick={() => {
                       setShowDeleteTopicModal(false);
                       setItemToDelete(null);
                     }}
                     className={styles.cancelButton}
                   >
                     Cancel
                   </button>
                   <button
                     onClick={confirmDeleteTopic}
                     disabled={isLoading}
                     className={styles.submitButton}
                   >
                     {isLoading ? 'Deleting...' : 'Delete'}
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}

         {/* Delete Vocabulary Confirmation Modal */}
         {showDeleteVocabModal && (
           <div className={styles.modalOverlay}>
             <div className={styles.modal}>
                <div className={styles.modalHeader}>
                 <div className={`${styles.modalIcon} ${styles.error}`}>
                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                   </svg>
                 </div>
                 <h3 className={styles.modalTitle}>Delete Vocabulary</h3>
                 <p className={styles.modalText}>
                   Are you sure you want to delete <span className={`${styles.modalHighlight} ${styles.error}`}>"{itemToDelete?.name}"</span>?
                 </p>
                 <div className={styles.modalButtons}>
                   <button
                     onClick={() => {
                       setShowDeleteVocabModal(false);
                       setItemToDelete(null);
                     }}
                     className={styles.cancelButton}
                   >
                     Cancel
                   </button>
                   <button
                     onClick={confirmDeleteVocab}
                     disabled={isLoading}
                     className={styles.submitButton}
                   >
                     {isLoading ? 'Deleting...' : 'Delete'}
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default Admin;
