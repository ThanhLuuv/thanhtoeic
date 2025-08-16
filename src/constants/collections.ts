// Firebase collection names constants
export const COLLECTIONS = {
  // User related
  USERS: 'users',
  
  // Vocabulary related
  VOCABULARY: 'vocabulary',
  TOPICS: 'topics',
  EXAMPLE_SENTENCES: 'example_sentences',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
