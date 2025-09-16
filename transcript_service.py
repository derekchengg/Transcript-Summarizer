from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import BartForConditionalGeneration, BartTokenizer
import re
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok", 
        "message": "Service running"
    })

@app.route('/transcript/<video_id>', methods=['GET'])
def get_transcript(video_id):
    try:
        print(f"Processing video: {video_id}")
        
        # Get transcript
        ytt_api = YouTubeTranscriptApi()
        fetched_transcript = ytt_api.fetch(video_id, languages=['en'])
        transcript_data = fetched_transcript.to_raw_data()
        full_text = " ".join([entry['text'] for entry in transcript_data])
        
        # Clean and preprocess
        clean_text = preprocess_text(full_text)
        word_count = len(clean_text.split())
        print(f"Clean word count: {word_count}")
        
        # Generate summary using simple approach from routes.py
        summary = summarize_transcript(clean_text)
        
        summary_word_count = len(summary.split())
        
        return jsonify({
            "success": True,
            "transcript": full_text,
            "summary": summary,
            "word_count": word_count,
            "word_count_summary": summary_word_count
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "transcript": "Transcript not available",
            "summary": "Summary not available"
        }), 404

def preprocess_text(text):
    """Clean and prepare text for summarization"""
    # Remove sponsor content and ads
    sponsor_patterns = [
        r'this video is sponsored by.*?(?=\.|$)',
        r'thanks to.*?for sponsoring.*?(?=\.|$)', 
        r'use code.*?(?=\.|$)',
        r'link in the description.*?(?=\.|$)',
        r'check out.*?in the description.*?(?=\.|$)',
        r'visit.*?\.com.*?(?=\.|$)'
    ]
    
    for pattern in sponsor_patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    
    # Clean up extra whitespace and formatting
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s.,!?;:]', '', text)
    text = text.strip()
    
    return text

def summarize_transcript(transcript, chunk_size=250):
    """Simple summarization approach from routes.py"""
    
    model_name = "facebook/bart-large-cnn"
    tokenizer = BartTokenizer.from_pretrained(model_name)
    model = BartForConditionalGeneration.from_pretrained(model_name)
    
    words = transcript.split()
    chunks = [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]

    summarized_text_chunks = []
    for i, chunk in enumerate(chunks):
        print(f"Summarizing chunk {i+1}/{len(chunks)}")
        inputs = tokenizer.encode(chunk, return_tensors="pt", truncation=True)
        summary_ids = model.generate(inputs, length_penalty=2.0, num_beams=4, early_stopping=True)
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        summarized_text_chunks.append(summary)

    # Join the summarized chunks
    full_summarized_text = ' '.join(summarized_text_chunks)
    return full_summarized_text

if __name__ == '__main__':
    port = int(os.environ.get('TRANSCRIPT_PORT', 3002))
    print(f"Starting simple BART service on port {port}")
    app.run(debug=True, port=port, host='0.0.0.0')