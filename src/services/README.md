# Services Architecture

## Overview
This directory contains all the Firebase services for the Vocabulary application. The services have been refactored to eliminate code duplication and improve maintainability.

## Architecture

### Base Classes
- **`BaseVocabularyService`**: Abstract base class providing common CRUD operations for vocabulary-related services
- **`FirebaseService`**: Base class for general Firebase operations

### Service Classes

#### Authentication
- **`firebaseAuthService`**: Handles user authentication, registration, and profile management

#### Vocabulary
- **`vocabularyService`**: Handles vocabulary operations and dictation practice

#### Specialized Services
- **`topicService`**: Manages vocabulary topics (extends BaseVocabularyService)
- **`wordTypeService`**: Manages word types (extends BaseVocabularyService)

#### Base Firebase Services
- **`userService`**: General user collection operations

## Key Improvements

### 1. Eliminated Code Duplication
- Common CRUD operations moved to base classes
- Consistent error handling across all services
- Standardized collection names using constants

### 2. Type Safety
- All types consolidated in `src/types/toeic.ts`
- No more duplicate interface definitions
- Consistent type usage across services

### 3. Maintainability
- Single source of truth for collection names
- Easy to add new services by extending base classes
- Consistent error handling patterns

### 4. Performance
- Reduced bundle size by eliminating duplicate code
- Better tree-shaking support
- Consistent caching patterns

## Usage Examples

```typescript
// Using specialized services
import { topicService, wordTypeService } from '../services';

// Get all topics
const topics = await topicService.getAllTopics();

// Create a word type
const wordType = await wordTypeService.createWordType({
  name: 'Noun',
  abbreviation: 'n',
  description: 'A person, place, thing, or idea'
});

// Using base services for general operations
import { vocabularyService } from '../services';

// Get vocabulary with custom query
const vocab = await vocabularyService.getWhere([
  where('difficulty', '==', 'easy'),
  limit(10)
]);
```

## Collection Names
All collection names are defined in `src/constants/collections.ts`:

- `USERS`: User profiles
- `VOCABULARY`: Vocabulary words
- `TOPICS`: Vocabulary topics
- `WORD_TYPES`: Word type categories

## Migration Notes
- Old service methods remain functional
- New services provide cleaner, more focused APIs
- Gradual migration recommended
- Backward compatibility maintained
