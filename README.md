# YouTube Transcript Summarizer

An AI-powered web application that extracts transcripts from YouTube videos and generates intelligent summaries using Facebook's BART (Bidirectional and Auto-Regressive Transformers) model.

## Features

- **YouTube Integration**: Extract transcripts from any YouTube video with available captions
- **AI Summarization**: Uses Facebook's BART-large-CNN model for high-quality text summarization
- **Clean Processing**: Automatically removes sponsor content, ads, and cleans up transcript text
- **Multi-chunk Processing**: Handles long videos by intelligently chunking and summarizing content
- **Real-time Processing**: Shows processing progress and timing information
- **Modern UI**: Clean, responsive React interface

## Architecture

The application consists of three main components:

1. **React Frontend** (`App.js`) - User interface for inputting YouTube URLs and displaying results
2. **Express.js Middleware** (`server.js`) - Handles API requests, YouTube metadata, and orchestrates services
3. **Python Flask Service** (`transcript_service.py`) - Handles transcript extraction and AI summarization

## Prerequisites

### Node.js Dependencies
- Node.js (v16 or higher)
- npm or yarn

### Python Dependencies
- Python 3.8 or higher
- pip

### API Keys
- YouTube Data API v3 key (for video metadata)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd youtube-transcript-summarizer
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Copy the example environment file and configure your settings:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
HUGGINGFACE_API_TOKEN=YOUR_KEY_HERE
PORT=3001
YOUTUBE_API_KEY=YOUR_KEY_HERE
TRANSCRIPT_SERVICE_URL=http://localhost:3002
```

### 5. Get YouTube API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API key)
5. Add your API key to the `.env` file

## Usage

### Starting the Application

**Terminal 1 - Python Flask Service:**
```bash
python transcript_service.py
```

**Terminal 2 - Express Server:**
```bash
npm run server
```

**Terminal 3 - React Frontend:**
```bash
npm start
```

### Accessing the Application
- Frontend: http://localhost:3000
- Express API: http://localhost:3001
- Python Service: http://localhost:3002

### Using the App
1. Open http://localhost:3000 in your browser
2. Paste a YouTube video URL into the input field
3. Click "Summarize" to process the video
4. View the generated summary and full transcript

## API Endpoints

### Express Server (Port 3001)
- `GET /` - Health check
- `GET /api/health` - API health status
- `POST /api/videos/summarize` - Main summarization endpoint

### Python Flask Service (Port 3002)
- `GET /health` - Service health check
- `GET /transcript/<video_id>` - Get transcript and summary for a video

## Project Structure
```
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main React component
│   ├── App.css             # Styling
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── server.js               # Express.js middleware server
├── transcript_service.py   # Python Flask AI service
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables template
└── README.md               # This file
```

## How It Works

1. **User Input**: User pastes YouTube URL into React frontend
2. **Request Processing**: Express server extracts video ID and fetches metadata
3. **Transcript Extraction**: Python service uses YouTube Transcript API to get captions
4. **Text Cleaning**: Removes sponsor content, ads, and cleans formatting
5. **AI Summarization**: BART model processes text in chunks for optimal results
6. **Response**: Summary and full transcript are returned to the frontend

## Technical Details

### AI Model
- **Model**: Facebook's BART-large-CNN
- **Use Case**: Optimized for summarization tasks
- **Processing**: Handles long transcripts through intelligent chunking
- **Parameters**: Uses beam search with length penalty for quality output

### Text Processing
- Removes common sponsor/advertisement patterns
- Cleans formatting and extra whitespace
- Handles special characters and punctuation
- Word-based chunking for consistent processing