// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3017',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  TOEIC: {
    PARTS: '/toeic/parts',
    TOPIC_PARTS: '/toeic/topic-parts',
    QUESTIONS: '/toeic/questions',
    TEST_RESULTS: '/toeic/test-results',
    QUESTIONS_BY_PART: (partId: number) => `/toeic/questions/part/${partId}`,
    QUESTIONS_BY_PART_WITH_DETAILS: (partId: number) => `/toeic/questions/part/${partId}/with-details`,
    TOPIC_PARTS_BY_PART: (partId: number) => `/toeic/topic-parts/part/${partId}`,
    TEST_RESULTS_BY_USER: (userId: string) => `/toeic/test-results/user/${userId}`,
    TEST_STATISTICS_BY_PART: (partId: number) => `/toeic/test-results/statistics/part/${partId}`,
    CREATE_PART1_WITH_AI: '/toeic/questions/part1/with-ai',
    // AI Question Generation endpoints
    GENERATE_SIMILAR_QUESTIONS: '/toeic/practice/similar-questions/generate',
    GENERATE_ADAPTIVE_QUESTIONS: '/toeic/practice/similar-questions/adaptive',
  },
  VOCABULARY: {
    WORD_TYPES: '/toeic/word-types',
    TOPICS: '/toeic/topics',
    VOCABULARY: '/toeic/vocabulary',
    ACTIVE_VOCABULARY: '/toeic/vocabulary/active',
    WORD_TYPE_BY_ID: (id: string) => `/toeic/word-types/${id}`,
    TOPIC_BY_ID: (id: string) => `/toeic/topics/${id}`,
    VOCABULARY_BY_ID: (id: string) => `/toeic/vocabulary/${id}`,
    VOCABULARY_BY_TOPIC: (topicId: string) => `/toeic/vocabulary/search/topic/${topicId}`,
    VOCABULARY_BY_WORD_TYPE: (wordTypeId: string) => `/toeic/vocabulary/search/word-type/${wordTypeId}`,
    VOCABULARY_BY_DIFFICULTY: (difficulty: number) => `/toeic/vocabulary/search/difficulty/${difficulty}`,
    SEARCH_VOCABULARY_BY_WORD: (word: string) => `/toeic/vocabulary/search/word?word=${encodeURIComponent(word)}`,
  },
  EXAMPLE_GENERATOR: {
    EXISTING_EXAMPLES: (vocabularyId: string | number) => `/toeic/example-generator/existing/${vocabularyId}`,
    GENERATE_EXAMPLE: '/toeic/example-generator/generate',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Common HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// API Response wrapper
export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

// Pagination interface
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
