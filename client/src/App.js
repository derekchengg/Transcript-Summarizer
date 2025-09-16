import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/videos/summarize', {
        youtube_link: youtubeLink
      });
      setResult(response.data);
    } catch (err) {
      setError('Error processing video: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>YouTube Transcript Summarizer</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            placeholder="Enter YouTube URL..."
            style={{ 
              width: '400px', 
              padding: '10px', 
              marginRight: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: loading ? '#ccc' : '#61dafb',
              color: loading ? '#666' : 'white',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : 'Summarize'}
          </button>
        </form>

        {error && (
          <div style={{ 
            color: '#ff6b6b', 
            margin: '20px', 
            padding: '10px',
            backgroundColor: '#ffe0e0',
            borderRadius: '4px',
            maxWidth: '800px'
          }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ 
            textAlign: 'left', 
            width: '900px', 
            margin: '10px 10px 10px 10px',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            color: '#333'
          }}>
            <h3>Results</h3>
            {result.title && <p><strong>Title:</strong> {result.title}</p>}
            {result.duration && <p><strong>Processing Time:</strong> {result.duration}</p>}
            <p><strong>Original Word Count:</strong> {result.word_count}</p>
            <p><strong>Summary Word Count:</strong> {result.word_count_summary}</p>

            <div style={{ marginTop: '20px' }}>
              <h3>AI Summary</h3>
              <textarea
                value={result.summary}
                readOnly
                rows="8"
                style={{ 
                  width: '90%', 
                  padding: '10px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
              />
            </div>

            <div style={{ marginTop: '20px' }}>
              <h3>Full Transcript</h3>
              <textarea
                value={result.transcript}
                readOnly
                rows="12"
                style={{ 
                  width: '90%', 
                  padding: '10px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '12px',
                  lineHeight: '1.4'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;