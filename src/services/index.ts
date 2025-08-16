export { firebaseAuthService } from './firebaseAuthService';

export { 
  FirebaseService, 
  userService
} from './firebaseService';

// Export all services
export { vocabularyService } from './vocabularyService';
export { topicService } from './topicService';
export { exampleGenerationService } from './exampleGenerationService';
export { exampleService } from './exampleService';

// Export types
export type { 
  ToeicVocabulary, 
  VocabularyItem, 
  VocabSetByTopic 
} from '../types/vocabulary';

export type { 
  ExampleSentence, 
  ExampleSentenceResponse, 
  GenerateExampleRequest, 
  GenerateExampleError,
  StoredExampleSentence,
  ExampleSentenceCreateRequest
} from '../types/example';