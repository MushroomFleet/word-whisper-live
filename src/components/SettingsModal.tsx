import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Theme } from '@/hooks/useTheme';
import { AppSettings } from '@/hooks/useLocalSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

const THEMES: { value: Theme; label: string; description: string }[] = [
  {
    value: 'modern-dark',
    label: 'Modern Dark',
    description: 'Clean dark theme with blue accents',
  },
  {
    value: 'retro-console',
    label: 'Retro Console',
    description: 'Matrix-inspired green-on-black terminal look',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [localProjectName, setLocalProjectName] = useState(settings.projectName);
  const [localSentencePause, setLocalSentencePause] = useState(settings.sentencePause);
  const [localParagraphPause, setLocalParagraphPause] = useState(settings.paragraphPause);
  const [localSleepMode, setLocalSleepMode] = useState(settings.sleepMode);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings({
      projectName: localProjectName.trim() || 'Untitled',
      sentencePause: localSentencePause,
      paragraphPause: localParagraphPause,
      sleepMode: localSleepMode,
    });
    onClose();
  };

  const handleThemeChange = (theme: Theme) => {
    onUpdateSettings({ theme });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-md mx-4 rounded-lg shadow-lg",
        "bg-popover border border-border",
        "animate-in fade-in-0 zoom-in-95 duration-200"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-popover-foreground">
            Settings
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="project-name" className="text-sm font-medium text-popover-foreground">
              Project Name
            </Label>
            <Input
              id="project-name"
              value={localProjectName}
              onChange={(e) => setLocalProjectName(e.target.value)}
              placeholder="Enter project name"
              className={cn(
                "theme-retro:bg-black theme-retro:border-green-500/30",
                "theme-retro:text-green-400 theme-retro:placeholder:text-green-600"
              )}
            />
            <p className="text-xs text-muted-foreground">
              Used for exported file names
            </p>
          </div>

          {/* Timing Settings */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-popover-foreground">
              Speech Timing
            </Label>
            
            {/* Sentence Pause */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground">
                  Sentence Pause
                </Label>
                <span className="text-xs text-muted-foreground">
                  {localSentencePause}s
                </span>
              </div>
              <Slider
                value={[localSentencePause]}
                onValueChange={(value) => setLocalSentencePause(value[0])}
                max={5}
                min={0.5}
                step={0.5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Pause duration to end a sentence and add period
              </p>
            </div>

            {/* Paragraph Pause */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground">
                  Paragraph Pause
                </Label>
                <span className="text-xs text-muted-foreground">
                  {localParagraphPause}s
                </span>
              </div>
              <Slider
                value={[localParagraphPause]}
                onValueChange={(value) => setLocalParagraphPause(value[0])}
                max={10}
                min={1}
                step={0.5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Pause duration to start a new paragraph
              </p>
            </div>

            {/* Sleep Mode */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground">
                  Sleep Mode
                </Label>
                <span className="text-xs text-muted-foreground">
                  {localSleepMode}s
                </span>
              </div>
              <Slider
                value={[localSleepMode]}
                onValueChange={(value) => setLocalSleepMode(value[0])}
                max={30}
                min={5}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Auto-stop transcription after silence
              </p>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-popover-foreground">
              Theme
            </Label>
            <div className="space-y-2">
              {THEMES.map((theme) => (
                <div
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className={cn(
                    "p-3 rounded-md border cursor-pointer transition-all duration-200",
                    "hover:bg-accent hover:border-accent-foreground/20",
                    settings.theme === theme.value
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card border-border text-card-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2",
                        settings.theme === theme.value
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      )}
                    />
                    <div>
                      <div className="font-medium">{theme.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {theme.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="default"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};