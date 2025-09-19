import React, { useState, useEffect } from 'react';
import { TranscriptionArea } from '@/components/TranscriptionArea';
import { ControlPanel } from '@/components/ControlPanel';
import { SettingsModal } from '@/components/SettingsModal';
import { Header } from '@/components/Header';
import { useTranscription } from '@/hooks/useTranscription';
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
  
  const transcription = useTranscription(settings);

  // Update transcript when transcription changes
  useEffect(() => {
    setTranscript(transcription.transcript);
  }, [transcription.transcript]);

  // Update theme when settings change
  useEffect(() => {
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
    transcription.clearTranscript();
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
            interimTranscript={transcription.interimTranscript}
            isListening={transcription.isListening}
            placeholder="Click 'Start Listening' to begin transcription..."
            onChange={setTranscript}
          />
          
          {/* Control Panel */}
          <div className="relative">
            <ControlPanel
              isListening={transcription.isListening}
              isSupported={transcription.isSupported}
              hasContent={transcript.length > 0}
              error={transcription.error}
              onStartListening={transcription.startListening}
              onStopListening={transcription.stopListening}
              onSave={handleSave}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>
          
          {/* Additional Actions */}
          {transcript.trim().length > 0 && !transcription.isListening && (
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