import { useState, useCallback, useRef, useEffect } from 'react';

interface AudioRecordingSettings {
  deviceId?: string;
  sampleRate?: number;
  channels?: number;
}

export const useAudioRecording = (settings?: AudioRecordingSettings) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: settings?.deviceId,
          sampleRate: settings?.sampleRate || 16000,
          channelCount: settings?.channels || 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioData(prev => [...prev, audioBlob]);
        chunksRef.current = [];
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
    }
  }, [settings]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, [isRecording]);

  const clearAudioData = useCallback(() => {
    setAudioData([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return {
    isRecording,
    audioData,
    error,
    startRecording,
    stopRecording,
    clearAudioData,
  };
};