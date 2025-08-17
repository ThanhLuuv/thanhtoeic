// Script to add vocabulary to Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import vocabularyData from './data.json' assert { type: 'json' };

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyCMBokj99we1G-tTgEzJa-te1ElO3DCD98",
  authDomain: "thanhtoeic-e1f58.firebaseapp.com",
  projectId: "thanhtoeic-e1f58",
  storageBucket: "thanhtoeic-e1f58.firebasestorage.app",
  messagingSenderId: "225528375762",
  appId: "1:225528375662:web:a78cb610a102a489af000b",
  measurementId: "G-NN3GBZ93V6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const WORDS_PER_SET = 40;

// Function to get topic name based on index
function getTopicName(idx) {
  if (idx * WORDS_PER_SET < 40) return 'Tourism';
  if (idx * WORDS_PER_SET < 80) return 'Accommodations & Food';
  if (idx * WORDS_PER_SET < 120) return 'Transportation';
  if (idx * WORDS_PER_SET < 160) return 'Stores';
  if (idx * WORDS_PER_SET < 200) return 'Purchase & Warranty';
  if (idx * WORDS_PER_SET < 240) return 'Performance';
  if (idx * WORDS_PER_SET < 280) return 'Exhibition & Museums';
  if (idx * WORDS_PER_SET < 320) return 'Arts';
  if (idx * WORDS_PER_SET < 360) return 'Real Estate';
  if (idx * WORDS_PER_SET < 400) return 'Media';
  return 'Unknown';
}

// Function to get topic ID from topic name
async function getTopicId(topicName) {
  try {
    const topicsRef = collection(db, 'topics');
    const q = query(topicsRef, where('name', '==', topicName));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }
    return null;
  } catch (error) {
    console.error(`Error getting topic ID for ${topicName}:`, error);
    return null;
  }
}

// Function to check if word already exists
async function wordExists(word) {
  try {
    const vocabRef = collection(db, 'vocabulary');
    const q = query(vocabRef, where('word', '==', word));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if word exists:', error);
    return false;
  }
}

// Function to add a single vocabulary item
async function addVocabulary(vocabData, topicName, topicId) {
  try {
    const vocabRef = collection(db, 'vocabulary');
    const docRef = await addDoc(vocabRef, {
      word: vocabData.word,
      wordType: vocabData.type,
      phonetic: vocabData.phonetic,
      meaning: vocabData.meaning,
      englishMeaning: vocabData.englishMeaning || '',
      audio: vocabData.audio || '',
      topicId: topicId,
      topic: topicName,
      exampleSentences: vocabData.exampleSentences || [],
      usageStats: vocabData.usageStats || {},
      tags: vocabData.tags || [],
      difficulty: vocabData.difficulty || 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✅ Word "${vocabData.word}" added successfully with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Error adding word "${vocabData.word}":`, error);
    throw error;
  }
}

// Main function to add all vocabulary
async function addAllVocabulary() {
  console.log('🚀 Starting to add vocabulary...');
  console.log(`📝 Found ${vocabularyData.length} words to add`);
  
  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  for (let idx = 0; idx < vocabularyData.length; idx++) {
    const vocab = vocabularyData[idx];
    const topicName = getTopicName(idx);
    try {
      // Check if word already exists
      const exists = await wordExists(vocab.word);
      
      if (exists) {
        console.log(`⏭️  Word "${vocab.word}" already exists, skipping...`);
        results.skipped.push(vocab.word);
        continue;
      }

      // Get topic ID
      const topicId = await getTopicId(topicName);
      if (!topicId) {
        console.error(`❌ Topic "${topicName}" not found for word "${vocab.word}"`);
        results.failed.push(vocab.word);
        continue;
      }

      // Add the vocabulary
      const vocabId = await addVocabulary(vocab, topicName, topicId);
      results.success.push({ word: vocab.word, id: vocabId });
      
      // Add a small delay to avoid overwhelming Firestore
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`💥 Failed to process word "${vocab.word}":`, error);
      results.failed.push(vocab.word);
    }
  }

  // Print summary
  console.log('\n📊 SUMMARY:');
  console.log(`✅ Successfully added: ${results.success.length} words`);
  console.log(`⏭️  Skipped (already exist): ${results.skipped.length} words`);
  console.log(`❌ Failed: ${results.failed.length} words`);
  
  if (results.success.length > 0) {
    console.log('\n✅ Successfully added words:');
    results.success.forEach(result => {
      console.log(`   - ${result.word} (ID: ${result.id})`);
    });
  }
  
  if (results.skipped.length > 0) {
    console.log('\n⏭️  Skipped words (already exist):');
    results.skipped.forEach(word => {
      console.log(`   - ${word}`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed words:');
    results.failed.forEach(word => {
      console.log(`   - ${word}`);
    });
  }

  return results;
}

// Function to list all existing vocabulary
async function listAllVocabulary() {
  try {
    const vocabRef = collection(db, 'vocabulary');
    const querySnapshot = await getDocs(vocabRef);
    
    console.log('\n📚 Current vocabulary in database:');
    querySnapshot.forEach((doc) => {
      const vocab = doc.data();
      console.log(`   - ${vocab.word} (Topic: ${vocab.topic}, ID: ${doc.id})`);
    });
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error listing vocabulary:', error);
    return 0;
  }
}

// Execute the script
async function main() {
  try {
    console.log('🔥 Firebase Vocabulary Manager');
    console.log('========================');
    
    // List current vocabulary
    const currentCount = await listAllVocabulary();
    console.log(`\n📊 Total current words: ${currentCount}`);
    
    // Add new vocabulary
    const results = await addAllVocabulary();
    
    // List updated vocabulary
    const updatedCount = await listAllVocabulary();
    console.log(`\n📊 Total words after update: ${updatedCount}`);
    
    console.log('\n🎉 Script completed successfully!');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
  }
}

// Export functions for use in other modules
export { addAllVocabulary, addVocabulary, wordExists, listAllVocabulary };

// Run the script if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  main().catch(console.error);
} else {
  // Browser environment - expose functions globally
  window.VocabularyManager = {
    addAllVocabulary,
    addVocabulary,
    wordExists,
    listAllVocabulary
  };
  
  console.log('🌐 VocabularyManager loaded in browser. Use window.VocabularyManager to access functions.');
}