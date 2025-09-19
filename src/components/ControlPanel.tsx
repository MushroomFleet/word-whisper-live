import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faDownload, faCog } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  isListening: boolean;
  isSupported: boolean;
  hasContent: boolean;
  error: string | null;
  onStartListening: () => void;
  onStopListening: () => void;
  onSave: () => void;
  onOpenSettings: () => void;
  className?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isListening,
  isSupported,
  hasContent,
  error,
  onStartListening,
  onStopListening,
  onSave,
  onOpenSettings,
  className,
}) => {
  const handleListenClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      {/* Listen/Stop Button */}
      <Button
        onClick={handleListenClick}
        variant={isListening ? "recording" : "listen"}
        size="xl"
        disabled={!isSupported}
        className={cn(
          "min-w-[150px] relative",
          isListening && "pulse-recording"
        )}
      >
        <FontAwesomeIcon 
          icon={isListening ? faStop : faMicrophone} 
          className="w-5 h-5"
        />
        {isListening ? 'Stop Recording' : 'Start Listening'}
      </Button>

      {/* Save Button */}
      <Button
        onClick={onSave}
        variant="save"
        size="lg"
        disabled={!hasContent}
        className="min-w-[120px]"
      >
        <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
        Save
      </Button>

      {/* Settings Button */}
      <Button
        onClick={onOpenSettings}
        variant="settings"
        size="lg"
      >
        <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
        Settings
      </Button>

      {/* Error Display */}
      {error && (
        <div className={cn(
          "absolute top-full mt-2 px-3 py-2 rounded-md",
          "bg-destructive/10 border border-destructive/20 text-destructive text-sm",
          "max-w-md text-center"
        )}>
          {error}
        </div>
      )}

      {/* Browser Support Warning */}
      {!isSupported && (
        <div className={cn(
          "absolute top-full mt-2 px-3 py-2 rounded-md",
          "bg-muted border border-border text-muted-foreground text-sm",
          "max-w-md text-center"
        )}>
          Speech recognition not supported. Please use Chrome for the best experience.
        </div>
      )}
    </div>
  );
};