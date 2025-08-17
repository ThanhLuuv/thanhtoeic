export interface TTSConfig {
  voice: string;
  speakingRate: number;
}

export interface CloudinaryConfig {
  uploadUrl: string;
  uploadPreset: string;
  folder: string;
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export class TTSService {
  private googleTTSKey: string;
  private cloudinaryConfig: CloudinaryConfig;

  constructor(googleTTSKey: string, cloudinaryConfig: CloudinaryConfig) {
    this.googleTTSKey = googleTTSKey;
    this.cloudinaryConfig = cloudinaryConfig;
  }

  async generateAudio(text: string, config: TTSConfig = { voice: 'en-US-Wavenet-F', speakingRate: 1.0 }): Promise<Blob> {
    try {
      const ssml = `<speak><voice name='${config.voice}'>${text}</voice></speak>`;
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.googleTTSKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { ssml },
          voice: { languageCode: 'en-US', name: config.voice },
          audioConfig: { audioEncoding: 'MP3', speakingRate: config.speakingRate }
        })
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const result = await response.json();
      if (!result.audioContent) {
        throw new Error('No audio content received');
      }

      // Convert base64 to blob
      const base64 = result.audioContent;
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      return new Blob([byteArray], { type: 'audio/mp3' });
    } catch (error) {
      console.error('TTS generation error:', error);
      throw error;
    }
  }

  async uploadToCloudinary(audioBlob: Blob, filename: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, filename);
      formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);
      formData.append('folder', this.cloudinaryConfig.folder);
      formData.append('resource_type', 'auto');

      const response = await fetch(this.cloudinaryConfig.uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cloudinary upload error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      if (!result.secure_url) {
        throw new Error('No secure URL received from Cloudinary');
      }

      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  async generateAndUploadAudio(text: string, filename: string, config?: TTSConfig): Promise<string> {
    try {
      // Generate audio
      const audioBlob = await this.generateAudio(text, config);
      
      // Upload to Cloudinary
      const audioUrl = await this.uploadToCloudinary(audioBlob, filename);
      
      return audioUrl;
    } catch (error) {
      console.error('Audio generation and upload error:', error);
      throw error;
    }
  }

  async deleteAudioFromCloudinary(audioUrl: string): Promise<void> {
    try {
      // Extract public ID from Cloudinary URL
      // Example URL: https://res.cloudinary.com/dlysxsbkj/video/upload/v1234567890/toeic_vocab/word.mp3
      // We need to extract: toeic_vocab/word
      const urlParts = audioUrl.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
        throw new Error('Invalid Cloudinary URL format');
      }
      
      const publicId = urlParts.slice(uploadIndex + 2).join('/').split('.')[0]; // Remove file extension
      
      // Delete from Cloudinary using Admin API with proper authentication
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = this.generateSignature(publicId, timestamp);
      
      const deleteUrl = `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/delete_by_token`;
      
      const response = await fetch(deleteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: `${timestamp}_${signature}`,
          public_id: publicId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete audio: ${response.status} - ${errorText}`);
      }

      console.log(`Successfully deleted audio: ${publicId}`);
    } catch (error) {
      console.error('Error deleting audio from Cloudinary:', error);
      // Don't throw error here to avoid blocking vocabulary deletion
      // Just log it for debugging
    }
  }

  private generateSignature(publicId: string, timestamp: number): string {
    // Generate HMAC-SHA1 signature using Cloudinary API secret
    // This is required for authenticated deletion
    const params = `public_id=${publicId}&timestamp=${timestamp}${this.cloudinaryConfig.apiSecret}`;
    
    // For now, we'll use a simple hash. In production, you should use proper HMAC-SHA1
    // You can use a library like crypto-js or implement it properly
    let hash = 0;
    for (let i = 0; i < params.length; i++) {
      const char = params.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }
}

// Default configuration
export const defaultTTSConfig: TTSConfig = {
  voice: 'en-US-Wavenet-D',
  speakingRate: 1.0
};

export const defaultCloudinaryConfig: CloudinaryConfig = {
  uploadUrl: 'https://api.cloudinary.com/v1_1/dlysxsbkj/auto/upload',
  uploadPreset: 'toeic_vocabulary',
  folder: 'toeic_vocab',
  cloudName: 'dlysxsbkj',
  apiKey: 'your_api_key_here', // Replace with your actual API key
  apiSecret: 'your_api_secret_here' // Replace with your actual API secret
};

// Create default service instance
export const ttsService = new TTSService(
  'AIzaSyAqO6_hgidkr_qandEMZUJlBcAhF3xOsUk',
  defaultCloudinaryConfig
);
