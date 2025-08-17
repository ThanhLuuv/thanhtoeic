import { useRef, useEffect } from 'react';

export const useAudioManager = (soundEnabled: boolean) => {
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const currentSpeech = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  const initAudioContext = () => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    } catch (error) {
      console.log('AudioContext not supported:', error);
    }
  };

  const resumeAudioContext = async () => {
    if (audioContext.current && audioContext.current.state === 'suspended') {
      try {
        await audioContext.current.resume();
      } catch (error) {
        console.log('Failed to resume audio context:', error);
      }
    }
  };

  // Initialize audio context on user interaction
  useEffect(() => {
    const handleUserInteraction = async () => {
      if (!audioContext.current) {
        initAudioContext();
        await resumeAudioContext();
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Initialize audio elements for success/error sounds
  useEffect(() => {
    const initAudioElements = async () => {
      try {
        // Preload success and error sounds
        const successAudio = new Audio('/asset/audio/success-sound.mp3');
        const errorAudio = new Audio('/asset/audio/error-sound.mp3');
        
        // Set low volume for system sounds
        successAudio.volume = 0.3;
        errorAudio.volume = 0.3;
        
        // Preload the audio files
        successAudio.load();
        errorAudio.load();
        
        // Store references for reuse
        successAudioRef.current = successAudio;
        errorAudioRef.current = errorAudio;
        
        console.log('Audio elements initialized successfully');
      } catch (error) {
        console.log('Failed to initialize audio elements:', error);
      }
    };

    if (soundEnabled) {
      initAudioElements();
    }
  }, [soundEnabled]);

  const stopCurrentAudio = () => {
    // Stop current audio
    if (currentAudio.current) {
      try {
        currentAudio.current.pause();
        currentAudio.current.currentTime = 0;
      } catch (error) {
        console.log('Error stopping audio:', error);
      }
      currentAudio.current = null;
    }
    
    // Stop current speech
    if (currentSpeech.current) {
      try {
        window.speechSynthesis.cancel();
      } catch (error) {
        console.log('Error stopping speech:', error);
      }
      currentSpeech.current = null;
    }
    isPlayingRef.current = false;
  };

  const playSuccessSound = async (): Promise<void> => {
    if (!soundEnabled) return;
    
    try {
      // Use preloaded audio if available
      if (successAudioRef.current) {
        const audio = successAudioRef.current;
        audio.currentTime = 0; // Reset to start
        currentAudio.current = audio;
        
        // Return a promise that resolves when audio ends
        return new Promise((resolve, reject) => {
          audio.addEventListener('ended', () => {
            currentAudio.current = null;
            resolve();
          });
          
          audio.addEventListener('error', () => {
            console.log('Success sound failed to play');
            currentAudio.current = null;
            reject(new Error('Success sound failed to play'));
          });
          
          audio.play().catch(reject);
        });
      }
      
      // Fallback to creating new audio if preloaded not available
      const audio = new Audio('/asset/audio/success-sound.mp3');
      audio.volume = 0.3;
      currentAudio.current = audio;
      
      // Return a promise that resolves when audio ends
      return new Promise((resolve, reject) => {
        audio.addEventListener('ended', () => {
          currentAudio.current = null;
          resolve();
        });
        
        audio.addEventListener('error', () => {
          console.log('Success sound failed to play');
          currentAudio.current = null;
          reject(new Error('Success sound failed to play'));
        });
        
        audio.play().catch(reject);
      });
    } catch (error) {
      console.log('Failed to play success sound:', error);
      throw error;
    }
  };

  const playErrorSound = async (): Promise<void> => {
    if (!soundEnabled) return;
    
    try {
      // Use preloaded audio if available
      if (errorAudioRef.current) {
        const audio = errorAudioRef.current;
        audio.currentTime = 0; // Reset to start
        currentAudio.current = audio;
        
        // Return a promise that resolves when audio ends
        return new Promise((resolve, reject) => {
          audio.addEventListener('ended', () => {
            currentAudio.current = null;
            resolve();
          });
          
          audio.addEventListener('error', () => {
            console.log('Error sound failed to play');
            currentAudio.current = null;
            reject(new Error('Error sound failed to play'));
          });
          
          audio.play().catch(reject);
        });
      }
      
      // Fallback to creating new audio if preloaded not available
      const audio = new Audio('/asset/audio/error-sound.mp3');
      audio.volume = 0.3;
      currentAudio.current = audio;
      
      // Return a promise that resolves when audio ends
      return new Promise((resolve, reject) => {
        audio.addEventListener('ended', () => {
          currentAudio.current = null;
          resolve();
        });
        
        audio.addEventListener('error', () => {
          console.log('Error sound failed to play');
          currentAudio.current = null;
          reject(new Error('Error sound failed to play'));
        });
        
        audio.play().catch(reject);
      });
    } catch (error) {
      console.log('Failed to play error sound:', error);
      throw error;
    }
  };

  const handlePlayAudio = async (audioUrl?: string, text?: string) => {
    if (!soundEnabled) return;
    
    // Stop any currently playing audio first
    stopCurrentAudio();
    
    // If a play is already in-flight, wait a bit before proceeding
    if (isPlayingRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    isPlayingRef.current = true;
    
    // Ensure audio context is ready
    await resumeAudioContext();
    
    if (audioUrl) {
      try {
        // Try to play the audio file with a shorter timeout
        const audio = new Audio();
        currentAudio.current = audio;
        
        // Add event listeners
        audio.addEventListener('ended', () => {
          currentAudio.current = null;
          isPlayingRef.current = false;
        });
        
        audio.addEventListener('error', () => {
          console.log('Audio file failed to load, falling back to text-to-speech');
          currentAudio.current = null;
          isPlayingRef.current = false;
          // Fallback to text-to-speech
          if (text) {
            const utterance = new window.SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            currentSpeech.current = utterance;
            window.speechSynthesis.speak(utterance);
          }
        });
        
        // Set audio source
        audio.src = audioUrl;
        audio.crossOrigin = 'anonymous';
        
        // Try to play with a shorter timeout and better error handling
        try {
          await audio.play();
          console.log('Audio playing successfully');
        } catch (playError) {
          console.log('Audio play failed, trying text-to-speech:', playError);
          currentAudio.current = null;
          isPlayingRef.current = false;
          
          // Don't throw error for AbortError, just fallback to TTS
          if (playError && typeof playError === 'object' && 'name' in playError && playError.name !== 'AbortError') {
            throw playError; // This will trigger the catch block below
          }
        }
        
      } catch (error) {
        console.log('Audio failed, using text-to-speech fallback:', error);
        currentAudio.current = null;
        
        // Fallback to text-to-speech
        if (text) {
          try {
            const utterance = new window.SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            currentSpeech.current = utterance;
            
            utterance.addEventListener('end', () => {
              currentSpeech.current = null;
              isPlayingRef.current = false;
            });
            
            utterance.addEventListener('error', () => {
              currentSpeech.current = null;
              isPlayingRef.current = false;
            });
            
            window.speechSynthesis.speak(utterance);
            console.log('Text-to-speech fallback activated');
          } catch (ttsError) {
            console.log('Text-to-speech also failed:', ttsError);
            isPlayingRef.current = false;
          }
        }
      } finally {
        // Ensure flag is cleared if neither audio nor tts is active
        if (!currentAudio.current && !currentSpeech.current) {
          isPlayingRef.current = false;
        }
      }
    } else if (text) {
      // Direct text-to-speech
      try {
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        currentSpeech.current = utterance;
        
        utterance.addEventListener('end', () => {
          currentSpeech.current = null;
          isPlayingRef.current = false;
        });
        
        utterance.addEventListener('error', () => {
          currentSpeech.current = null;
          isPlayingRef.current = false;
        });
        
        window.speechSynthesis.speak(utterance);
        console.log('Text-to-speech playing');
      } catch (error) {
        console.log('Text-to-speech failed:', error);
        currentSpeech.current = null;
        isPlayingRef.current = false;
      }
    }
  };

  const isAudioReady = () => {
    return soundEnabled && (audioContext.current?.state === 'running' || window.speechSynthesis);
  };

  return {
    playSuccessSound,
    playErrorSound,
    handlePlayAudio,
    stopCurrentAudio,
    isAudioReady
  };
}; 