import { useState, useCallback } from 'react';

interface WhisperSettings {
  serverUrl?: string;
  model?: string;
  engine: 'server' | 'browser';
}

interface TranscriptionResult {
  text: string;
  confidence?: number;
}

export const useWhisperTranscription = (settings: WhisperSettings) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<TranscriptionResult | null> => {
    setIsTranscribing(true);
    setError(null);

    try {
      if (settings.engine === 'server') {
        return await transcribeWithServer(audioBlob, settings.serverUrl!, settings.model);
      } else {
        return await transcribeWithBrowser(audioBlob);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transcription failed');
      return null;
    } finally {
      setIsTranscribing(false);
    }
  }, [settings]);

  return {
    transcribeAudio,
    isTranscribing,
    error,
  };
};

async function transcribeWithServer(
  audioBlob: Blob, 
  serverUrl: string, 
  model?: string
): Promise<TranscriptionResult> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', model || 'whisper-1');

  const response = await fetch(`${serverUrl}/v1/audio/transcriptions`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return {
    text: result.text || '',
    confidence: result.confidence,
  };
}

async function transcribeWithBrowser(audioBlob: Blob): Promise<TranscriptionResult> {
  // This would use @huggingface/transformers for browser-based Whisper
  // For now, we'll throw an error as it requires the library to be installed
  throw new Error('Browser-based Whisper not implemented yet. Install @huggingface/transformers first.');
}