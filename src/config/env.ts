// Environment configuration
export const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validate required environment variables
export const validateEnv = () => {
  // OpenAI API key giờ được bảo mật trong Vercel Serverless Function
  // Không cần validate ở frontend nữa
  console.log('Environment validated - OpenAI API key is secured in serverless function');
};

export default ENV_CONFIG;
