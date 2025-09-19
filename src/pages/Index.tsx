import React, { useState } from 'react';
import { TranscriptionArea } from '@/components/TranscriptionArea';
import { ControlPanel } from '@/components/ControlPanel';
import { SettingsModal } from '@/components/SettingsModal';
import { Header } from '@/components/Header';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTheme } from '@/hooks/useTheme';
import { useLocalSettings } from '@/hooks/useLocalSettings';
import { exportTranscript } from '@/utils/fileExport';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Index = () => {
  const [transcript, setTranscript] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useLocalSettings();
  const { toast } = useToast();
  
  const {
    isListening,
    transcript: speechTranscript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechRecognition({
    sentencePause: settings.sentencePause,
    paragraphPause: settings.paragraphPause,
    sleepMode: settings.sleepMode,
  });

  // Update transcript when speech recognition provides new text
  React.useEffect(() => {
    if (speechTranscript) {
      setTranscript(speechTranscript);
    }
  }, [speechTranscript]);

  // Update theme when settings change
  React.useEffect(() => {
    if (settings.theme !== theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, theme, setTheme]);

  const handleSave = () => {
    const contentToExport = transcript.trim();
    if (!contentToExport) {
      toast({
        title: "Nothing to save",
        description: "Please transcribe some content before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      exportTranscript(contentToExport, settings.projectName);
      toast({
        title: "Transcript saved!",
        description: `Exported as ${settings.projectName}_${new Date().toISOString().split('T')[0]}.txt`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: "There was an error saving your transcript. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearTranscript = () => {
    setTranscript('');
    clearTranscript();
  };

  const handleUpdateSettings = (newSettings: Partial<typeof settings>) => {
    updateSettings(newSettings);
    
    if (newSettings.theme) {
      setTheme(newSettings.theme);
    }
    
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved.",
    });
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      "gradient-primary"
    )}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header 
          projectName={settings.projectName}
          theme={theme}
          className="mb-8"
        />
        
        <div className="space-y-6">
          {/* Main Transcription Area */}
          <TranscriptionArea
            transcript={transcript}
            interimTranscript={interimTranscript}
            isListening={isListening}
            onChange={setTranscript}
            className="w-full"
          />
          
          {/* Control Panel */}
          <div className="relative">
            <ControlPanel
              isListening={isListening}
              isSupported={isSupported}
              hasContent={transcript.trim().length > 0}
              error={error}
              onStartListening={startListening}
              onStopListening={stopListening}
              onSave={handleSave}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>
          
          {/* Additional Actions */}
          {transcript.trim().length > 0 && !isListening && (
            <div className="flex justify-center">
              <button
                onClick={handleClearTranscript}
                className={cn(
                  "text-sm text-muted-foreground hover:text-foreground",
                  "underline underline-offset-2 transition-colors duration-200",
                  "theme-retro:text-green-600 theme-retro:hover:text-green-400"
                )}
              >
                Clear transcript
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <footer className={cn(
          "mt-16 text-center text-xs text-muted-foreground/60",
          "theme-retro:text-green-700 theme-retro:font-mono"
        )}>
          CarelessLive v1.0 • Zero-data speech transcription • No data stored or transmitted
        </footer>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
};

export default Index;