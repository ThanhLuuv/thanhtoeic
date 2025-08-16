// Firebase collection names constants
export const COLLECTIONS = {
  // User related
  USERS: 'users',
  
  // Vocabulary related
  VOCABULARY: 'vocabulary',
  TOPICS: 'topics',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
