import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Palette, Timer, Volume2, Pause, Moon, Mic, Server, Globe } from "lucide-react";
import { AppSettings, TranscriptionEngine } from "@/hooks/useLocalSettings";
import { Theme } from "@/hooks/useTheme";
import { useState } from "react";

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
  const [projectName, setProjectName] = useState(settings.projectName);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(settings.theme);
  const [sentencePause, setSentencePause] = useState([settings.sentencePause]);
  const [paragraphPause, setParagraphPause] = useState([settings.paragraphPause]);
  const [sleepMode, setSleepMode] = useState([settings.sleepMode]);
  const [transcriptionEngine, setTranscriptionEngine] = useState<TranscriptionEngine>(settings.transcriptionEngine);
  const [whisperServerUrl, setWhisperServerUrl] = useState(settings.whisperServerUrl || '');
  const [whisperModel, setWhisperModel] = useState(settings.whisperModel || '');

  const handleSave = () => {
    onUpdateSettings({
      projectName,
      theme: selectedTheme,
      sentencePause: sentencePause[0],
      paragraphPause: paragraphPause[0],
      sleepMode: sleepMode[0],
      transcriptionEngine,
      whisperServerUrl: whisperServerUrl || undefined,
      whisperModel: whisperModel || undefined,
    });
    onClose();
  };

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your transcription preferences and appearance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Project Name</Label>
            </div>
            
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Used for exported file names
            </p>
          </div>

          <Separator />

          {/* Timing Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Speech Timing</Label>
            </div>
            
            {/* Sentence Pause */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground">
                  <Volume2 className="h-3 w-3 inline mr-1" />
                  Sentence Pause
                </Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {sentencePause[0]}s
                </span>
              </div>
              <Slider
                value={sentencePause}
                onValueChange={setSentencePause}
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
                  <Pause className="h-3 w-3 inline mr-1" />
                  Paragraph Pause
                </Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {paragraphPause[0]}s
                </span>
              </div>
              <Slider
                value={paragraphPause}
                onValueChange={setParagraphPause}
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
                  <Moon className="h-3 w-3 inline mr-1" />
                  Sleep Mode
                </Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {sleepMode[0]}s
                </span>
              </div>
              <Slider
                value={sleepMode}
                onValueChange={setSleepMode}
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

          <Separator />
          
          {/* Transcription Engine Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Transcription Engine</Label>
            </div>
            
            <Select value={transcriptionEngine} onValueChange={(value: TranscriptionEngine) => setTranscriptionEngine(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="browser">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Browser Speech API</span>
                    <Badge variant="secondary" className="ml-2">Free</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="whisper-server">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span>Local Whisper Server</span>
                    <Badge variant="outline" className="ml-2">Advanced</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="whisper-local">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    <span>Browser Whisper</span>
                    <Badge variant="outline" className="ml-2">Beta</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {transcriptionEngine === 'whisper-server' && (
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label htmlFor="whisper-url" className="text-sm">Server URL</Label>
                  <Input
                    id="whisper-url"
                    value={whisperServerUrl}
                    onChange={(e) => setWhisperServerUrl(e.target.value)}
                    placeholder="http://localhost:8000"
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL of your local Whisper server API
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whisper-model" className="text-sm">Model</Label>
                  <Input
                    id="whisper-model"
                    value={whisperModel}
                    onChange={(e) => setWhisperModel(e.target.value)}
                    placeholder="whisper-1"
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Whisper model to use (e.g., whisper-1, base, small, medium, large)
                  </p>
                </div>
              </div>
            )}

            {transcriptionEngine === 'whisper-local' && (
              <div className="pl-6 border-l-2 border-muted">
                <p className="text-xs text-muted-foreground">
                  Runs Whisper models directly in your browser using WebAssembly. 
                  Requires downloading model files (~40-1500MB depending on model size).
                </p>
              </div>
            )}
          </div>

          <Separator />
          
          {/* Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Theme</Label>
            </div>
            
            <div className="space-y-2">
              {THEMES.map((theme) => (
                <div
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className={`p-3 rounded-md border cursor-pointer transition-all duration-200 hover:bg-accent hover:border-accent-foreground/20 ${
                    selectedTheme === theme.value
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card border-border text-card-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedTheme === theme.value
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};