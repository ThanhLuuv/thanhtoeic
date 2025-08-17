import React from 'react';
import { TTSConfig } from '../../services/ttsService';
import styles from './TTSSettings.module.css';

interface TTSSettingsProps {
  config: TTSConfig;
  onConfigChange: (config: TTSConfig) => void;
}

const TTSSettings: React.FC<TTSSettingsProps> = ({ config, onConfigChange }) => {
  const voices = [
    { value: 'en-US-Wavenet-D', label: 'Nam (B) - US' },
    { value: 'en-US-Wavenet-F', label: 'Nam (D) - US' },
    { value: 'en-GB-Wavenet-B', label: 'Nữ (C) - UK' },
    { value: 'en-US-Neural2-D', label: 'Nữ (E) - US' },
  ];

  const speakingRates = [
    { value: 0.75, label: 'Chậm (0.75x)' },
    { value: 1.0, label: 'Bình thường (1.0x)' },
    { value: 1.25, label: 'Nhanh (1.25x)' },
    { value: 1.5, label: 'Rất nhanh (1.5x)' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <h3 className={styles.title}>TTS Settings</h3>
      </div>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Giọng đọc
          </label>
          <select
            value={config.voice}
            onChange={(e) => onConfigChange({ ...config, voice: e.target.value })}
            className={styles.select}
          >
            {voices.map((voice) => (
              <option key={voice.value} value={voice.value}>
                {voice.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Tốc độ đọc
          </label>
          <select
            value={config.speakingRate}
            onChange={(e) => onConfigChange({ ...config, speakingRate: parseFloat(e.target.value) })}
            className={styles.select}
          >
            {speakingRates.map((rate) => (
              <option key={rate.value} value={rate.value}>
                {rate.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TTSSettings;
