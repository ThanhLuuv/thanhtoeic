// Script to add new topics to Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

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

// New topics to add
const newTopics = [
  {
    name: 'Tourism',
    description: 'Travel and tourism related vocabulary and phrases',
    category: 'travel',
    difficulty: 'intermediate',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Accommodations & Food',
    description: 'Hotel, restaurant, and food service vocabulary',
    category: 'travel',
    difficulty: 'intermediate',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Transportation',
    description: 'Public transport, vehicles, and travel vocabulary',
    category: 'travel',
    difficulty: 'intermediate',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Stores',
    description: 'Shopping, retail, and store-related vocabulary',
    category: 'shopping',
    difficulty: 'intermediate',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Purchase & Warranty',
    description: 'Buying, selling, and warranty vocabulary',
    category: 'shopping',
    difficulty: 'intermediate',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Performance',
    description: 'Performance evaluation and assessment vocabulary',
    category: 'business',
    difficulty: 'intermediate',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Exhibition & Museums',
    description: 'Cultural events, exhibitions, and museum vocabulary',
    category: 'culture',
    difficulty: 'intermediate',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Arts',
    description: 'Art, creativity, and artistic expression vocabulary',
    category: 'culture',
    difficulty: 'intermediate',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Real Estate',
    description: 'Property, housing, and real estate vocabulary',
    category: 'business',
    difficulty: 'intermediate',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Media',
    description: 'News, entertainment, and media industry vocabulary',
    category: 'media',
    difficulty: 'intermediate',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Function to check if topic already exists
async function topicExists(topicName) {
  try {
    const topicsRef = collection(db, 'topics');
    const q = query(topicsRef, where('name', '==', topicName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if topic exists:', error);
    return false;
  }
}

// Function to add a single topic
async function addTopic(topicData) {
  try {
    const topicsRef = collection(db, 'topics');
    const docRef = await addDoc(topicsRef, topicData);
    console.log(`✅ Topic "${topicData.name}" added successfully with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Error adding topic "${topicData.name}":`, error);
    throw error;
  }
}

// Main function to add all topics
async function addAllTopics() {
  console.log('🚀 Starting to add new topics...');
  console.log(`📝 Found ${newTopics.length} topics to add`);
  
  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  for (const topic of newTopics) {
    try {
      // Check if topic already exists
      const exists = await topicExists(topic.name);
      
      if (exists) {
        console.log(`⏭️  Topic "${topic.name}" already exists, skipping...`);
        results.skipped.push(topic.name);
        continue;
      }

      // Add the topic
      const topicId = await addTopic(topic);
      results.success.push({ name: topic.name, id: topicId });
      
      // Add a small delay to avoid overwhelming Firestore
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`💥 Failed to process topic "${topic.name}":`, error);
      results.failed.push(topic.name);
    }
  }

  // Print summary
  console.log('\n📊 SUMMARY:');
  console.log(`✅ Successfully added: ${results.success.length} topics`);
  console.log(`⏭️  Skipped (already exist): ${results.skipped.length} topics`);
  console.log(`❌ Failed: ${results.failed.length} topics`);
  
  if (results.success.length > 0) {
    console.log('\n✅ Successfully added topics:');
    results.success.forEach(result => {
      console.log(`   - ${result.name} (ID: ${result.id})`);
    });
  }
  
  if (results.skipped.length > 0) {
    console.log('\n⏭️  Skipped topics (already exist):');
    results.skipped.forEach(name => {
      console.log(`   - ${name}`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed topics:');
    results.failed.forEach(name => {
      console.log(`   - ${name}`);
    });
  }

  return results;
}

// Function to list all existing topics
async function listAllTopics() {
  try {
    const topicsRef = collection(db, 'topics');
    const querySnapshot = await getDocs(topicsRef);
    
    console.log('\n📚 Current topics in database:');
    querySnapshot.forEach((doc) => {
      const topic = doc.data();
      console.log(`   - ${topic.name} (ID: ${doc.id})`);
    });
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error listing topics:', error);
    return 0;
  }
}

// Execute the script
async function main() {
  try {
    console.log('🔥 Firebase Topics Manager');
    console.log('========================');
    
    // List current topics
    const currentCount = await listAllTopics();
    console.log(`\n📊 Total current topics: ${currentCount}`);
    
    // Add new topics
    const results = await addAllTopics();
    
    // List updated topics
    const updatedCount = await listAllTopics();
    console.log(`\n📊 Total topics after update: ${updatedCount}`);
    
    console.log('\n🎉 Script completed successfully!');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
  }
}

// Export functions for use in other modules
export { addAllTopics, addTopic, topicExists, listAllTopics };

// Run the script if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  main().catch(console.error);
} else {
  // Browser environment - expose functions globally
  window.TopicsManager = {
    addAllTopics,
    addTopic,
    topicExists,
    listAllTopics
  };
  
  console.log('🌐 TopicsManager loaded in browser. Use window.TopicsManager to access functions.');
}
