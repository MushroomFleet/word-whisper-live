# Transcription Engine Options

This application offers three different transcription engines to convert your speech to text. Each has different benefits and setup requirements.

## 🌐 Browser Speech API (Default)

**Best for**: Quick setup, general use, most users

### Features
- ✅ **No setup required** - Works immediately in supported browsers
- ✅ **Real-time transcription** - Instant text as you speak
- ✅ **Free** - No costs or API keys needed
- ✅ **Privacy-focused** - All processing happens locally in your browser

### Limitations
- ⚠️ **Browser support** - Only works in Chrome, Edge, and some Chromium-based browsers
- ⚠️ **Internet required** - Needs connection to Google's speech services
- ⚠️ **Language** - Currently configured for English (US) only
- ⚠️ **Accuracy** - Good but may struggle with technical terms or accents

### Setup
1. Open Settings
2. Select "Browser Speech API" as your transcription engine
3. Allow microphone permissions when prompted
4. Start transcribing immediately!

---

## 🖥️ Local Whisper Server (Advanced)

**Best for**: High accuracy, offline use, technical users, privacy-conscious users

### Features
- ✅ **High accuracy** - Superior transcription quality using OpenAI's Whisper models
- ✅ **Offline capable** - Works without internet once set up
- ✅ **Complete privacy** - All processing happens on your local machine
- ✅ **Customizable models** - Choose from different Whisper model sizes

### Requirements
- 🔧 **Technical setup required** - Need to run a local Whisper server
- 💻 **Local server** - Must have a Whisper-compatible API server running
- 🔌 **API endpoint** - Requires server that accepts OpenAI-compatible API calls

### Setup Instructions

#### Option 1: Using whisper-server (Python)
```bash
# Install whisper-server
pip install whisper-server

# Run the server (adjust model size as needed)
whisper-server --model base --host 0.0.0.0 --port 8000
```

#### Option 2: Using faster-whisper-server
```bash
# Install faster-whisper-server  
pip install faster-whisper-server

# Run the server
faster-whisper-server --model-size base --host 0.0.0.0 --port 8000
```

#### Option 3: Using OpenAI-compatible servers
Any server that implements the OpenAI transcription API format at `/v1/audio/transcriptions`

### App Configuration
1. Open Settings
2. Select "Local Whisper Server" as your transcription engine
3. Enter your server URL (default: `http://localhost:8000`)
4. Choose your model name (e.g., `base`, `small`, `medium`, `large`)
5. Save settings and start transcribing

### Model Sizes & Performance
- **tiny**: Fastest, lowest accuracy (~39 MB)
- **base**: Good balance of speed and accuracy (~74 MB) - **Recommended**
- **small**: Better accuracy, slower (~244 MB)
- **medium**: Higher accuracy (~769 MB)
- **large**: Best accuracy, slowest (~1550 MB)

---

## 🌍 Browser Whisper (Beta)

**Best for**: Offline use without server setup, experimental users

### Features
- ✅ **No server required** - Runs Whisper models directly in your browser
- ✅ **Offline capable** - Works without internet after initial model download
- ✅ **Privacy-focused** - All processing happens locally
- ✅ **Easy setup** - No server configuration needed

### Limitations
- ⚠️ **Beta status** - Currently not fully implemented
- ⚠️ **Large downloads** - Model files are 40MB-1.5GB in size
- ⚠️ **Performance** - May be slower than server-based Whisper
- ⚠️ **Browser compatibility** - Requires modern browser with WebAssembly support

### Setup (When Available)
1. Open Settings
2. Select "Browser Whisper" as your transcription engine
3. The browser will download the required model files automatically
4. Wait for model initialization (may take several minutes on first use)
5. Start transcribing

---

## ⚙️ Speech Timing Settings

All transcription engines support these customizable timing parameters:

### Sentence Pause (Default: 1 second)
- **Range**: 0.5 - 5 seconds
- **Function**: Pause duration to end a sentence and add a period
- **Effect**: Shorter = more frequent periods, Longer = fewer sentence breaks

### Paragraph Pause (Default: 3 seconds)
- **Range**: 1 - 10 seconds
- **Function**: Pause duration to start a new paragraph
- **Effect**: Creates natural paragraph breaks in your text

### Sleep Mode (Default: 9 seconds)
- **Range**: 5 - 30 seconds
- **Function**: Auto-stop transcription after extended silence
- **Effect**: Automatically stops recording when you're done speaking

---

## 🔧 Troubleshooting

### Browser Speech API Issues
- **No response**: Check if you're using Chrome/Edge and have internet connection
- **Permission denied**: Allow microphone access in browser settings
- **Poor accuracy**: Try speaking more clearly or adjusting timing settings

### Local Whisper Server Issues
- **Connection failed**: Verify server is running and URL is correct
- **Slow transcription**: Try a smaller model size or check server performance
- **Server errors**: Check server logs and ensure proper installation

### General Issues
- **No microphone detected**: Check system audio settings and browser permissions
- **Choppy audio**: Close other applications using the microphone
- **Settings not saving**: Check browser localStorage permissions

---

## 💡 Recommendations

- **New users**: Start with Browser Speech API for immediate use
- **Privacy-focused**: Use Local Whisper Server for complete data control
- **High accuracy needs**: Local Whisper Server with medium/large models
- **Offline work**: Local Whisper Server or Browser Whisper (when available)
- **Technical users**: Local Whisper Server for full customization

Choose the option that best fits your technical comfort level, privacy requirements, and accuracy needs!
```
