import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
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

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const lastSpeechTime = useRef<number>(Date.now());

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
          
          // Check for paragraph breaks (3+ second pause)
          const now = Date.now();
          const timeSinceLastSpeech = now - lastSpeechTime.current;
          
          // Capitalize first letter of the sentence
          const capitalizedTranscript = transcriptPart.charAt(0).toUpperCase() + transcriptPart.slice(1);
          
          setTranscript(prev => {
            if (prev.length === 0) {
              // First sentence - just add the capitalized text with period
              return capitalizedTranscript + '.';
            } else {
              // Subsequent sentences
              if (timeSinceLastSpeech > 3000) {
                // Long pause - add paragraph break
                return prev + '\n\n' + capitalizedTranscript + '.';
              } else {
                // Short pause - add space and continue same paragraph
                return prev + ' ' + capitalizedTranscript + '.';
              }
            }
          });
          
          lastSpeechTime.current = now;
        } else {
          interim += transcriptPart;
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
    };

    recognition.onstart = () => {
      setError(null);
      setIsListening(true);
      lastSpeechTime.current = Date.now();
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