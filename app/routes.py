from flask import Blueprint, render_template, request
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import BartForConditionalGeneration, BartTokenizer

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html', transcript="")

@main.route('/process-youtube-link', methods=['POST'])
def process_youtube_link():
    youtube_link = request.form['youtube_link']
    video_id = extract_video_id(youtube_link)
    transcript = fetch_transcript(video_id)
    summary = summarize_transcript(transcript)
    word_count = get_word_count(transcript)
    word_count_summary = get_word_count(summary)

    return render_template('index.html', transcript=transcript, summary=summary, word_count=word_count, word_count_summary=word_count_summary)

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

def summarize_transcript(transcript):
    word_count = get_word_count(transcript)

    max_length = word_count // 2
    min_length = word_count // 4

    model_name = "facebook/bart-large-cnn"
    tokenizer = BartTokenizer.from_pretrained(model_name)
    model = BartForConditionalGeneration.from_pretrained(model_name)

    inputs = tokenizer.encode("summarize: " + transcript, return_tensors="pt", max_length=1024, truncation=True)

    summary_ids = model.generate(inputs, max_length=max_length, min_length=min_length, length_penalty=2.0, num_beams=4, early_stopping=False)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return summary

def get_word_count(transcript):
    words = transcript.split()
    return len(words)

def get_word_count_summary(summary):
    words = summary.split()
    return len(words)

if __name__ == '__main__':
    app.run(debug=True)
