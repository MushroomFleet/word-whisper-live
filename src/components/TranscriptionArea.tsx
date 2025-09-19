import React from 'react';
import { cn } from '@/lib/utils';

interface TranscriptionAreaProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const TranscriptionArea: React.FC<TranscriptionAreaProps> = ({
  transcript,
  interimTranscript,
  isListening,
  placeholder = "",
  onChange,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const displayText = transcript + (interimTranscript ? ` ${interimTranscript}` : '');
  const showCursor = isListening && !interimTranscript;

  return (
    <div className={cn("relative", className)}>
      <textarea
        value={transcript}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "w-full min-h-[400px] resize-none rounded-lg border border-input bg-card px-4 py-3",
          "text-card-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          "transition-all duration-200",
          "font-mono text-base leading-relaxed",
          // Retro theme styling
          "theme-retro:text-glow theme-retro:bg-black theme-retro:border-green-500/30",
          "theme-retro:focus:ring-green-500 theme-retro:focus:ring-offset-black"
        )}
        style={{ 
          fontSize: '16px', // Prevent zoom on mobile
          lineHeight: '1.6'
        }}
      />
      
      {/* Interim transcript overlay */}
      {interimTranscript && (
        <div className={cn(
          "absolute inset-0 px-4 py-3 pointer-events-none",
          "text-card-foreground/70 font-mono text-base leading-relaxed",
          "theme-retro:text-green-400/70"
        )}>
          {/* Hidden text to position interim correctly */}
          <span className="invisible whitespace-pre-wrap">{transcript}</span>
          {/* Interim text */}
          <span className="text-primary italic">
            {transcript ? ' ' : ''}{interimTranscript}
          </span>
        </div>
      )}
      
      {/* Typing cursor */}
      {showCursor && (
        <div className={cn(
          "absolute px-4 py-3 pointer-events-none font-mono text-base leading-relaxed",
          "typing-cursor"
        )}
        style={{
          left: '0',
          top: '0'
        }}>
          <span className="invisible whitespace-pre-wrap">{transcript}</span>
        </div>
      )}
      
      {/* Status indicator */}
      {isListening && (
        <div className={cn(
          "absolute top-2 right-2 flex items-center gap-2",
          "px-2 py-1 rounded-md bg-recording/20 border border-recording/30",
          "text-xs text-recording-foreground"
        )}>
          <div className="w-2 h-2 bg-recording rounded-full animate-pulse" />
          Recording
        </div>
      )}
    </div>
  );
};