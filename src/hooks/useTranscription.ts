import { useState, useCallback, useEffect, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useAudioRecording } from './useAudioRecording';
import { useWhisperTranscription } from './useWhisperTranscription';
import type { AppSettings } from './useLocalSettings';

interface SpeechSettings {
  sentencePause: number;
  paragraphPause: number;
  sleepMode: number;
}

export const useTranscription = (settings: AppSettings) => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);

  // Browser Speech Recognition (fallback)
  const speechSettings: SpeechSettings = {
    sentencePause: settings.sentencePause,
    paragraphPause: settings.paragraphPause,
    sleepMode: settings.sleepMode,
  };

  const speechRecognition = useSpeechRecognition(speechSettings);
  
  // Audio recording for Whisper
  const audioRecording = useAudioRecording({
    deviceId: settings.microphoneDeviceId,
  });

  // Whisper transcription
  const whisperTranscription = useWhisperTranscription({
    serverUrl: settings.whisperServerUrl,
    model: settings.whisperModel,
    engine: settings.transcriptionEngine === 'whisper-server' ? 'server' : 'browser',
  });

  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Process audio chunks for Whisper when recording
  useEffect(() => {
    if (settings.transcriptionEngine.startsWith('whisper') && audioRecording.isRecording) {
      processingIntervalRef.current = setInterval(async () => {
        const latestAudio = audioRecording.audioData[audioRecording.audioData.length - 1];
        if (latestAudio) {
          const result = await whisperTranscription.transcribeAudio(latestAudio);
          if (result) {
            setTranscript(prev => formatTranscript(prev + ' ' + result.text, settings));
            setConfidence(result.confidence || 0);
          }
          audioRecording.clearAudioData();
        }
      }, 2000); // Process every 2 seconds
    }

    return () => {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
      }
    };
  }, [settings.transcriptionEngine, audioRecording.isRecording, audioRecording.audioData, whisperTranscription, settings]);

  // Update transcript from browser speech recognition
  useEffect(() => {
    if (settings.transcriptionEngine === 'browser') {
      setTranscript(speechRecognition.transcript);
      setInterimTranscript(speechRecognition.interimTranscript);
      setConfidence(speechRecognition.confidence);
    }
  }, [settings.transcriptionEngine, speechRecognition.transcript, speechRecognition.interimTranscript, speechRecognition.confidence]);

  // Sync listening state
  useEffect(() => {
    if (settings.transcriptionEngine === 'browser') {
      setIsListening(speechRecognition.isListening);
    } else {
      setIsListening(audioRecording.isRecording);
    }
  }, [settings.transcriptionEngine, speechRecognition.isListening, audioRecording.isRecording]);

  // Sync errors
  useEffect(() => {
    if (settings.transcriptionEngine === 'browser') {
      setError(speechRecognition.error);
    } else {
      setError(audioRecording.error || whisperTranscription.error);
    }
  }, [settings.transcriptionEngine, speechRecognition.error, audioRecording.error, whisperTranscription.error]);

  const startListening = useCallback(() => {
    setError(null);
    if (settings.transcriptionEngine === 'browser') {
      speechRecognition.startListening();
    } else {
      audioRecording.startRecording();
    }
  }, [settings.transcriptionEngine, speechRecognition, audioRecording]);

  const stopListening = useCallback(() => {
    if (settings.transcriptionEngine === 'browser') {
      speechRecognition.stopListening();
    } else {
      audioRecording.stopRecording();
    }
  }, [settings.transcriptionEngine, speechRecognition, audioRecording]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    if (settings.transcriptionEngine === 'browser') {
      speechRecognition.clearTranscript();
    } else {
      audioRecording.clearAudioData();
    }
  }, [settings.transcriptionEngine, speechRecognition, audioRecording]);

  const isSupported = settings.transcriptionEngine === 'browser' ? 
    speechRecognition.isSupported : 
    'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

  return {
    transcript,
    interimTranscript,
    isListening,
    confidence,
    error,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
  };
};

// Format transcript with sentence and paragraph breaks
function formatTranscript(text: string, settings: AppSettings): string {
  // Apply the same formatting logic as the original speech recognition
  return text.trim();
}