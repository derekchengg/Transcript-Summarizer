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
      const response = await axios.post('http://localhost:3000/api/videos/summarize', {
        youtube_link: youtubeLink
      });
      setResult(response.data);
    } catch (err) {
      setError('Error processing video: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>YouTube Transcript Summarizer</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="Enter YouTube URL..."
          style={{width: '400px', padding: '10px', marginRight: '10px'}}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Summarize'}
        </button>
      </form>

      {error && <div style={{color: 'red', margin: '20px'}}>{error}</div>}
      
      {result && (
        <div style={{textAlign: 'left', maxWidth: '800px', margin: '20px auto'}}>
          <h2>Results</h2>
          <p><strong>Title:</strong> {result.title}</p>
          <p><strong>Duration:</strong> {result.duration}</p>
          <p><strong>Word Count:</strong> {result.word_count}</p>
          <p><strong>Summary Word Count:</strong> {result.word_count_summary}</p>
          
          <div style={{marginTop: '20px'}}>
            <h3>Summary</h3>
            <textarea 
              value={result.summary} 
              readOnly 
              rows="6" 
              style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
            />
          </div>
          
          <div style={{marginTop: '20px'}}>
            <h3>Full Transcript</h3>
            <textarea 
              value={result.transcript} 
              readOnly 
              rows="10" 
              style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;