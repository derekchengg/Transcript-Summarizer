require('dotenv').config();
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3001;
const transcriptServiceUrl = process.env.TRANSCRIPT_SERVICE_URL || 'http://localhost:3002'

// Middleware first
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json())

app.get('/', (req, res) => {
  console.log('GET / requested')
  res.json({ 
    message: 'YouTube Transcript Summarizer API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      summarize: 'POST /api/videos/summarize'
    }
  })
})

app.get('/api/health', (req, res) => {
  console.log('GET /api/health requested')
  res.json({ 
    "status": "ok", 
    "message": "Server running",
    "timestamp": new Date().toISOString(),
    "services": {
      "express": "running",
      "python_service": transcriptServiceUrl
    }
  })
})

app.post('/api/videos/summarize', async (req, res) => {
  const stopwatch = new Stopwatch();
  stopwatch.startWatch();

  console.log('Received POST request for video summarization');
  console.log('Request body:', req.body);

  const youtube_link = req.body.youtube_link;

  if (!youtube_link) {
    return res.status(400).json({ 
      error: 'youtube_link is required',
      message: 'Please provide a valid YouTube URL'
    });
  }

  try {
    const video_id = extractVideoId(youtube_link);
    
    if (!video_id) {
      return res.status(400).json({
        error: 'Invalid YouTube URL',
        message: 'Could not extract video ID from the provided URL'
      });
    }
    
    console.log('Extracted video ID:', video_id);

    const [title, transcriptResponse] = await Promise.all([
      getYouTubeVideoTitle(video_id, process.env.YOUTUBE_API_KEY),
      fetchTranscriptFromPythonService(video_id)
    ]);

    const transcript = transcriptResponse.transcript;
    const summary = transcriptResponse.summary || summarizeTranscript(transcript);
    const wordCount = transcriptResponse.word_count || getWordCount(transcript);
    const wordCountSummary = transcriptResponse.word_count_summary || getWordCount(summary);

    console.log('Processing completed:', {
      video_id,
      title: title ? 'Retrieved' : 'Not available',
      transcript_length: transcript.length,
      summary_length: summary.length,
      word_count: wordCount,
      summary_word_count: wordCountSummary
    });

    stopwatch.stopWatch();
    const duration = stopwatch.resetWatch();

    res.json({
      success: true,
      video_id: video_id,
      title: title || 'Title not available',
      youtube_link: youtube_link,
      transcript: transcript,
      summary: summary,
      word_count: wordCount,
      word_count_summary: wordCountSummary,
      duration: duration
    });

  } catch (error) {
    console.error('Error processing video:', error);
    stopwatch.stopWatch();
    const duration = stopwatch.resetWatch();
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to process video',
      message: error.message,
      duration: duration
    });
  }
});

async function fetchTranscriptFromPythonService(video_id) {
  try {
    console.log('Fetching transcript from Python service for:', video_id);
    
    const response = await axios.get(`${transcriptServiceUrl}/transcript/${video_id}`, {
      timeout: 300000
    });
    
    console.log('Python service response received:', {
      success: response.data.success,
      transcript_length: response.data.transcript?.length,
      summary_length: response.data.summary?.length
    });

    if (response.data.success) {
      return {
        transcript: response.data.transcript,
        summary: response.data.summary,
        word_count: response.data.word_count,
        word_count_summary: response.data.word_count_summary
      };
    } else {
      throw new Error(response.data.error || 'Failed to fetch transcript');
    }
    
  } catch (error) {
    console.error('Error fetching transcript from Python service:', {
      message: error.message,
      response_data: error.response?.data,
      status: error.response?.status
    });
    
    return {
      transcript: "Transcript not available - Python service error",
      summary: "Summary not available - Python service error",
      word_count: 0,
      word_count_summary: 0
    };
  }
}

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function getYouTubeVideoTitle(video_id, api_key) {
  try {
    if (!api_key) {
      console.warn('YouTube API key not provided');
      return null;
    }

    const url = `https://www.googleapis.com/youtube/v3/videos?id=${video_id}&key=${api_key}&part=snippet`;
    const response = await axios.get(url, { timeout: 10000 });

    if (response.status === 200 && response.data.items.length > 0) {
      return response.data.items[0].snippet.title;
    } else {
      console.warn('No video found with ID:', video_id);
      return null;
    }
  } catch (error) {
    console.error('Error fetching video title:', error.message);
    return null;
  }
}

function summarizeTranscript(transcript, chunkSize = 250) {
  try {
    const words = transcript.split(' ');

    if (words.length <= chunkSize) {
      return transcript;
    }

    const firstPortion = words.slice(0, Math.floor(chunkSize / 2)).join(' ');
    const lastPortion = words.slice(-Math.floor(chunkSize / 2)).join(' ');

    return `${firstPortion}... ${lastPortion}`;

  } catch (error) {
    console.error('Error summarizing transcript:', error);
    return transcript.substring(0, 200) + '...';
  }
}

function getWordCount(text) {
  if (!text || text.trim() === '') {
    return 0;
  }
  return text.trim().split(/\s+/).length;
}

class Stopwatch {
  constructor() {
    this.startTime = null;
    this.elapsedTime = 0;
    this.isRunning = false;
  }

  startWatch() {
    if (!this.isRunning) {
      this.startTime = Date.now();
      this.isRunning = true;
      console.log("Stopwatch started");
    }
  }

  stopWatch() {
    if (this.isRunning) {
      this.elapsedTime = Date.now() - this.startTime;
      this.isRunning = false;
      console.log("Stopwatch stopped");
    }
  }

  resetWatch() {
    const elapsed = this.elapsedTime / 1000;
    this.elapsedTime = 0;
    this.isRunning = false;
    this.startTime = null;

    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    const elapsedTimeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    console.log(`Processing time: ${elapsedTimeFormatted}`);
    return elapsedTimeFormatted;
  }
}

app.listen(port, () => {
  console.log(`Express server started on port ${port}`)
  console.log(`Frontend: http://localhost:3000`)
  console.log(`API: http://localhost:${port}`)
  console.log(`Python service: ${transcriptServiceUrl}`)
})