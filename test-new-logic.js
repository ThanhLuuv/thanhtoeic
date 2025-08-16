// Test new logic for vocabulary set indexing by topic and set index
const testNewVocabularyLogic = () => {
  // Mock data structure similar to what we have
  const mockVocabSetsByTopic = [
    {
      topic: "Business",
      sets: [
        [{ word: "business1", meaning: "meaning1" }, { word: "business2", meaning: "meaning2" }],
        [{ word: "business3", meaning: "meaning3" }, { word: "business4", meaning: "meaning4" }]
      ]
    },
    {
      topic: "Technology",
      sets: [
        [{ word: "tech1", meaning: "meaning1" }, { word: "tech2", meaning: "meaning2" }]
      ]
    },
    {
      topic: "Other",
      sets: [
        [{ word: "other1", meaning: "meaning1" }, { word: "other2", meaning: "meaning2" }]
      ]
    }
  ];

  console.log("Mock data:", mockVocabSetsByTopic);

  // Test the new logic from DictationList.tsx
  const getAllSets = () => {
    const allSets = [];
    let globalSetIndex = 0;
    const WORDS_PER_SET = 20;
    
    mockVocabSetsByTopic.forEach((topicData, topicIndex) => {
      if (topicData.sets && Array.isArray(topicData.sets)) {
        // Calculate how many sets we can create for this topic
        const topicVocabularyCount = topicData.sets.reduce((total, set) => {
          if (set && Array.isArray(set) && set.length > 0) {
            return total + set.length;
          }
          return total;
        }, 0);
        
        const setsForTopic = Math.ceil(topicVocabularyCount / WORDS_PER_SET);
        
        console.log(`Topic "${topicData.topic}": ${topicVocabularyCount} words, ${setsForTopic} sets`);
        
        // Create sets for this topic
        for (let setIndex = 0; setIndex < setsForTopic; setIndex++) {
          allSets.push({
            set: [], // We'll load this dynamically
            idx: allSets.length,
            originalIdx: globalSetIndex,
            topic: topicData.topic || 'Other',
            topicSetIndex: setIndex
          });
          
          console.log(`Created set:`, {
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
    
    console.log(`Total sets created:`, allSets.length);
    console.log(`All sets:`, allSets.map(s => ({
      originalIdx: s.originalIdx,
      topic: s.topic,
      topicSetIndex: s.topicSetIndex,
      globalSetIndex: s.originalIdx
    })));
    
    return allSets;
  };

  // Test the new logic from vocabularyService.ts
  const getVocabularySetByTopicAndSetIndex = (topicName, setIndex) => {
    console.log(`Getting vocabulary for topic: ${topicName}, set index: ${setIndex}`);
    
    // Find the topic data
    const topicData = mockVocabSetsByTopic.find(t => t.topic === topicName);
    if (!topicData) {
      throw new Error(`Topic "${topicName}" not found`);
    }
    
    // Get all vocabulary for the topic
    let topicVocabulary = [];
    topicData.sets.forEach(set => {
      if (set && Array.isArray(set) && set.length > 0) {
        topicVocabulary.push(...set);
      }
    });
    
    console.log(`Found ${topicVocabulary.length} words for topic "${topicName}"`);
    
    // Calculate start and end index for the set
    const startIndex = setIndex * WORDS_PER_SET;
    const endIndex = startIndex + WORDS_PER_SET;
    
    console.log(`Set ${setIndex}: words ${startIndex} to ${endIndex - 1}`);
    
    if (startIndex >= topicVocabulary.length) {
      throw new Error(`Set index ${setIndex} is out of range for topic "${topicName}". Available words: ${topicVocabulary.length}`);
    }
    
    // Get the words for this set
    const setWords = topicVocabulary.slice(startIndex, endIndex);
    
    console.log(`Returning ${setWords.length} words for set ${setIndex}:`, {
      startIndex,
      endIndex,
      words: setWords.map(v => v.word)
    });
    
    return setWords;
  };

  console.log("\n=== Testing new DictationList logic ===");
  const allSets = getAllSets();

  console.log("\n=== Testing new vocabularyService logic ===");
  
  // Test each topic
  const testTopics = ["Business", "Technology", "Other"];
  
  testTopics.forEach(topicName => {
    console.log(`\n--- Testing topic: ${topicName} ---`);
    
    // Find how many sets this topic has
    const topicSets = allSets.filter(s => s.topic === topicName);
    console.log(`Topic "${topicName}" has ${topicSets.length} sets`);
    
    // Test each set
    for (let setIndex = 0; setIndex < topicSets.length; setIndex++) {
      console.log(`\n--- Testing set ${setIndex} for topic "${topicName}" ---`);
      try {
        const result = getVocabularySetByTopicAndSetIndex(topicName, setIndex);
        console.log(`Result for topic "${topicName}" set ${setIndex}:`, result.map(v => v.word));
        
        // Check if this matches what we expect
        const expectedSet = topicSets.find(s => s.topicSetIndex === setIndex);
        if (expectedSet) {
          console.log(`Set ${setIndex} for topic "${topicName}" is valid`);
        }
      } catch (error) {
        console.error(`Error for topic "${topicName}" set ${setIndex}:`, error.message);
      }
    }
  });
};

// Run the test
testNewVocabularyLogic();
