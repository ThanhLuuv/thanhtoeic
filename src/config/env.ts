// Environment configuration
export const ENV_CONFIG = {
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validate required environment variables
export const validateEnv = () => {
  if (!ENV_CONFIG.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY không được cấu hình. Example generation sẽ không hoạt động.');
  }
};

export default ENV_CONFIG;
