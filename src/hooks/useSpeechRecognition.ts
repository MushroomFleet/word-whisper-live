import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface SpeechSettings {
  sentencePause: number; // seconds
  paragraphPause: number; // seconds
  sleepMode: number; // seconds
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useSpeechRecognition = (settings?: SpeechSettings): UseSpeechRecognitionReturn => {
  // Default settings
  const speechSettings = {
    sentencePause: settings?.sentencePause ?? 1,
    paragraphPause: settings?.paragraphPause ?? 3,
    sleepMode: settings?.sleepMode ?? 9,
  };
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const lastFinalResultTime = useRef<number>(Date.now());
  const speechEndTime = useRef<number>(Date.now());
  const sleepTimer = useRef<NodeJS.Timeout | null>(null);

  // Check if speech recognition is supported
  const isSupported = !!(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );

  const initializeRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptPart = result[0].transcript.trim();

        if (result.isFinal) {
          finalTranscript += transcriptPart;
          setConfidence(result[0].confidence);
          
          // Check for paragraph breaks based on time since last final result
          const now = Date.now();
          const timeSinceLastFinal = now - lastFinalResultTime.current;
          
          // Capitalize first letter of the sentence
          const capitalizedTranscript = transcriptPart.charAt(0).toUpperCase() + transcriptPart.slice(1);
          
          setTranscript(prev => {
            if (prev.length === 0) {
              // First sentence - just add the capitalized text with period
              lastFinalResultTime.current = now;
              return capitalizedTranscript + '.';
            } else {
              // Subsequent sentences - check timing for paragraph breaks
              if (timeSinceLastFinal > speechSettings.paragraphPause * 1000) {
                // Long pause - add paragraph break
                lastFinalResultTime.current = now;
                return prev + '\n\n' + capitalizedTranscript + '.';
              } else if (timeSinceLastFinal > speechSettings.sentencePause * 1000) {
                // Sentence pause - add space and continue same paragraph
                lastFinalResultTime.current = now;
                return prev + ' ' + capitalizedTranscript + '.';
              } else {
                // Very short pause - continue same sentence
                lastFinalResultTime.current = now;
                return prev + ' ' + capitalizedTranscript + '.';
              }
            }
          });
          
        } else {
          interim += transcriptPart;
          // Update speech end time while interim results are coming in
          speechEndTime.current = Date.now();
          
          // Reset sleep timer when we get new speech
          if (sleepTimer.current) {
            clearTimeout(sleepTimer.current);
          }
          
          // Set new sleep timer
          sleepTimer.current = setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }, speechSettings.sleepMode * 1000);
        }
      }

      if (interim) {
        setInterimTranscript(interim);
      } else {
        setInterimTranscript('');
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      if (sleepTimer.current) {
        clearTimeout(sleepTimer.current);
        sleepTimer.current = null;
      }
    };

    recognition.onstart = () => {
      setError(null);
      setIsListening(true);
      lastFinalResultTime.current = Date.now();
      speechEndTime.current = Date.now();
    };

    return recognition;
  }, [isSupported, transcript]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    try {
      recognitionRef.current = initializeRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError('Failed to start speech recognition');
    }
  }, [initializeRecognition, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (sleepTimer.current) {
      clearTimeout(sleepTimer.current);
      sleepTimer.current = null;
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (sleepTimer.current) {
        clearTimeout(sleepTimer.current);
      }
    };
  }, []);

  return {
    isListening,
    transcript: transcript.trim(),
    interimTranscript,
    confidence,
    error,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
  };
};