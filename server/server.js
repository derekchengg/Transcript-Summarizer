require('dotenv').config();
const express = require('express')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 3000

const YoutubeTranscript = require('youtube-transcript');

// Middleware first
app.use(express.json())

// All routes next
app.get('/', (req, res) => {
  console.log('GET / requested')
  res.send('Hello World!')
})

app.get('/api/health', (req, res) => {
  console.log('GET /api/health requested')
  res.json({ "status": "ok", "message": "Server running" })
})

app.post('/api/videos/summarize', async (req, res) => {

  const stopwatch = new Stopwatch();
  stopwatch.startWatch();

  console.log('Received POST request');
  console.log('Request body:', req.body);

  const youtube_link = req.body.youtube_link;

  if (!youtube_link) {
    return res.status(400).json({ error: 'youtube_link is required' });
  }

  const video_id = extractVideoId(youtube_link);
  console.log('Extracted video ID:', video_id);

  const title = await getYouTubeVideoTitle(video_id, process.env.YOUTUBE_API_KEY);
  const transcript = await fetchTranscript(video_id);
  const summary = summarizeTranscript(transcript);
  const wordCount = getWordCount(transcript);
  const wordCountSummary = getWordCount(summary);

  console.log('Transcript length:', transcript.length);
  console.log('Summary length:', summary.length);
  console.log('Transcript word count:', wordCount);
  console.log('Summary word count:', wordCountSummary);

  stopwatch.stopWatch();
  const duration = stopwatch.resetWatch();

  res.json({
    video_id: video_id,
    title: title,
    youtube_link: youtube_link,
    transcript: transcript,
    summary: summary,
    word_count: wordCount,
    word_count_summary: wordCountSummary,
    duration: duration
  });
});

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function getYouTubeVideoTitle(video_id, api_key) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${video_id}&key=${api_key}&part=snippet`;
    const response = await axios.get(url);

    if (response.status === 200 && response.data.items.length > 0) {
      return response.data.items[0].snippet.title;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching video title:', error);
    return null;
  }
}

async function fetchTranscript(video_id) {
  try {
    console.log('Attempting to fetch transcript for:', video_id);

    const placeholderTranscript = `Placeholder`;

    console.log('Using placeholder transcript');
    return placeholderTranscript;

  } catch (error) {
    console.error('Error fetching transcript:', error.message);
    return "Transcript not available";
  }
}

function formatTranscript(transcript) {
  let formatted_text = "";
  for (const line of transcript) {
    formatted_text += `${line.text} `;
  }
  return formatted_text;
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
      console.log("Stopwatch has started");
    }
  }

  stopWatch() {
    if (this.isRunning) {
      this.elapsedTime = Date.now() - this.startTime;
      this.isRunning = false;
      console.log("Stopwatch has stopped");
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
    console.log(`Time: ${elapsedTimeFormatted}`);
    return elapsedTimeFormatted;
  }
}

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
  console.log(`Visit: http://localhost:${port}`)
})