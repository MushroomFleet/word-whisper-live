# Installation Guide for Windows

This guide will help you set up and run the Speech-to-Text Transcription Application on your local Windows machine.

## 📋 Prerequisites

Before installing, ensure you have the following installed on your Windows system:

### Required Software

1. **Node.js** (Version 18 or higher recommended)
   - Download from: https://nodejs.org/
   - Choose the "LTS" (Long Term Support) version
   - During installation, make sure to check "Add to PATH" option

2. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/download/win
   - Use default installation options

3. **A modern web browser**
   - Chrome (recommended for speech recognition)
   - Microsoft Edge
   - Firefox (limited speech recognition support)

### Verify Installation

Open **Command Prompt** or **PowerShell** and verify your installations:

```cmd
node --version
npm --version
git --version
```

You should see version numbers for all three commands.

---

## 🚀 Installation Steps

### Step 1: Clone the Repository

1. Open **Command Prompt** or **PowerShell**
2. Navigate to where you want to install the project (e.g., `C:\Users\YourName\Documents\`)
3. Clone the repository:

```cmd
git clone https://github.com/YOUR_USERNAME/speech-transcription-app.git
```

> Replace `YOUR_USERNAME/speech-transcription-app.git` with the actual repository URL

### Step 2: Navigate to Project Directory

```cmd
cd speech-transcription-app
```

### Step 3: Install Dependencies

Install all required npm packages:

```cmd
npm install
```

This will download and install all necessary dependencies. It may take a few minutes.

### Step 4: Start the Development Server

```cmd
npm run dev
```

You should see output similar to:
```
  VITE v5.4.19  ready in 523 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 5: Open the Application

1. Open your web browser
2. Navigate to: `http://localhost:8080`
3. The application should load and be ready to use!

---

## 🎤 First Time Setup

### Allow Microphone Access

When you first use the transcription feature:

1. Your browser will ask for microphone permission
2. Click **"Allow"** to grant access
3. If you accidentally clicked "Block", you can change this in browser settings:
   - **Chrome**: Click the 🔒 lock icon next to the URL → Permissions → Microphone → Allow
   - **Edge**: Similar to Chrome
   - **Firefox**: Click the 🛡️ shield icon → Permissions → Microphone → Allow

### Choose Your Transcription Engine

The app offers three transcription options:

1. **Browser Speech API** (Default - Easiest)
   - Works immediately with internet connection
   - Good for general use

2. **Local Whisper Server** (Advanced - Best accuracy)
   - Requires additional setup (see [WHISPER.md](docs/WHISPER.md))
   - Works offline once configured

3. **Browser Whisper** (Beta - Currently not implemented)
   - Future feature for offline browser-based transcription

---

## 🔧 Optional: Local Whisper Server Setup

For the highest accuracy transcription that works offline, you can set up a local Whisper server:

### Prerequisites for Whisper
- **Python 3.8+** installed on your system
- At least 4GB of available RAM
- 2GB+ free disk space for models

### Quick Whisper Server Setup

1. **Install Python** (if not already installed):
   - Download from: https://www.python.org/downloads/
   - During installation, check "Add Python to PATH"

2. **Open Command Prompt as Administrator**

3. **Install whisper-server**:
   ```cmd
   pip install whisper-server
   ```

4. **Start the Whisper server**:
   ```cmd
   whisper-server --model base --host 0.0.0.0 --port 8000
   ```

5. **Configure the app**:
   - Open the transcription app in your browser
   - Click Settings (⚙️ gear icon)
   - Select "Local Whisper Server" as transcription engine
   - Server URL should be: `http://localhost:8000`
   - Model name: `base`
   - Save settings

For detailed Whisper setup instructions, see [WHISPER.md](docs/WHISPER.md).

---

## 📁 Project Structure

```
speech-transcription-app/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Application pages
│   └── utils/             # Utility functions
├── docs/                  # Documentation
├── public/                # Static assets
├── package.json           # Project dependencies
└── README.md             # Project information
```

---

## 🎯 Usage Quick Start

1. **Start transcription**: Click the microphone button
2. **Speak clearly**: The app will convert your speech to text in real-time
3. **Adjust settings**: Click the gear icon to customize:
   - Transcription engine
   - Speech timing (sentence/paragraph pauses)
   - Theme preferences
4. **Export text**: Use the export button to save your transcription

---

## 🛠️ Development Commands

For developers who want to modify the application:

```cmd
# Start development server with hot reloading
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

---

## 🔧 Troubleshooting

### Common Issues

**"npm is not recognized"**
- Node.js wasn't properly installed or added to PATH
- Restart Command Prompt and try again
- Reinstall Node.js and ensure "Add to PATH" is checked

**"Permission denied" errors**
- Run Command Prompt as Administrator
- Or use PowerShell with appropriate execution policy

**Application won't start**
- Check if port 8080 is already in use
- Close other development servers
- Try `npm run dev -- --port 3000` to use a different port

**Microphone not working**
- Check browser permissions
- Ensure microphone is not being used by other applications
- Try using Chrome or Edge browsers

**Poor transcription accuracy**
- Use a better microphone/headset
- Speak more clearly and at moderate pace
- Consider using Local Whisper Server for better accuracy
- Adjust timing settings in the app

### Getting Help

- Check the [WHISPER.md](docs/WHISPER.md) for transcription engine details
- Look at browser console (F12) for error messages
- Ensure all dependencies are properly installed with `npm install`

---

## 🔄 Updating the Application

To get the latest updates:

```cmd
# Pull latest changes from repository
git pull origin main

# Install any new dependencies
npm install

# Restart the development server
npm run dev
```

---

## 🎉 You're Ready!

Your Speech-to-Text Transcription Application is now installed and ready to use! 

- The app runs locally on your machine
- All transcription happens privately (no data sent to external servers by default)
- Customize settings to match your speaking style and preferences

Enjoy transcribing your thoughts, meetings, and ideas with ease! 🎤✨
