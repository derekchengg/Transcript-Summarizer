from flask import Blueprint, render_template, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import BartForConditionalGeneration, BartTokenizer
from .utils import Stopwatch
import requests
import os

main = Blueprint('main', __name__)

stopwatch = Stopwatch()
api_key = os.getenv('YOUTUBE_API_KEY')

@main.route('/')
def index():
    return render_template('index.html', transcript="")

@main.route('/process-youtube-link', methods=['POST'])
def process_youtube_link():
    
    stopwatch.startWatch()
    
    youtube_link = request.form['youtube_link']
    video_id = extract_video_id(youtube_link)
    title = get_youtube_video_title(video_id, api_key)
    transcript = fetch_transcript(video_id)
    summary = summarize_transcript(transcript)
    word_count = get_word_count(transcript)
    word_count_summary = get_word_count(summary)
    
    stopwatch.stopWatch()
    time_elapsed = stopwatch.resetWatch()
    
    print(title)

    return jsonify({
        "transcript": transcript, 
        "summary": summary, 
        "word_count": word_count, 
        "word_count_summary": word_count_summary, 
        "duration": time_elapsed,  
        "title": title
    })

def extract_video_id(youtube_link):
    return youtube_link.split('=')[-1]

def fetch_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        formatted_transcript = format_transcript(transcript)
        return formatted_transcript
    except Exception as e:
        print(f"Error fetching transcript: {e}")
        return "Transcript not available"

def format_transcript(transcript):
    formatted_text = ""
    for line in transcript:
        formatted_text += f"{line['text']} "
    return formatted_text

def get_word_count(transcript):
    words = transcript.split()
    return len(words)

def get_word_count_summary(summary):
    words = summary.split()
    return len(words)

def summarize_transcript(transcript, chunk_size=250):

    model_name = "facebook/bart-large-cnn"
    tokenizer = BartTokenizer.from_pretrained(model_name)
    model = BartForConditionalGeneration.from_pretrained(model_name)
    
    words = transcript.split()
    chunks = [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]

    summarized_text_chunks = []
    for chunk in chunks:
        inputs = tokenizer.encode(chunk, return_tensors="pt", truncation=True)
        summary_ids = model.generate(inputs, length_penalty=2.0, num_beams=4, early_stopping=True)
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        summarized_text_chunks.append(summary)

    # Join the summarized chunks
    full_summarized_text = ' '.join(summarized_text_chunks)
    return full_summarized_text

def get_youtube_video_title(video_id, api_key):
    url = f"https://www.googleapis.com/youtube/v3/videos?id={video_id}&key={api_key}&part=snippet"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        # Assuming only one video is requested, take the first item
        video_title = data['items'][0]['snippet']['title']
        return video_title
    else:
        return None

if __name__ == '__main__':
    main.run(debug=True)
