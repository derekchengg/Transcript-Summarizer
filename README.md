# Transcript-Summarizer

This web application summarizes YouTube video transcripts using AI-powered models.

## Home Page
<img src="https://github.com/Hytherist/Transcript-Summarizer/blob/main/app/showcase/Youtube%20Transcript%20Home.png?raw=true" alt="alttext" width="600">

## Features

- **Transcript Summarization:** This feature allows users to input a YouTube video link and receive a concise summary of its transcript. It's perfect for quickly grasping the main points without having to watch the entire video.
  
- **Visibility of Status:** Users will be informed of the summarization progress through a loading indicator. This ensures transparency and lets users know that their request is being processed.
  
- **Word Count Display:** Users can easily track the total word count of the original transcript as well as the word count of the generated summary. This provides insight into the length and conciseness of the summary compared to the original content.
  
- **Continuous Summarizations:** The system supports consecutive summarizations, enabling users to input multiple YouTube links for summarization without interruption or limitation.
  
- **Copy to Clipboard:** Once the summary is generated, users have the option to conveniently copy both the original transcript and the summarized text to their clipboard. This facilitates easy sharing and reference of the summarized content.
  
- **Time Execution:** Users are provided with information regarding the time taken to perform the summarization process. This gives them an idea of the system's performance and allows them to manage their time effectively.

## Installation

1. Clone this repository.
2. Set up a virtual environment (optional but recommended).
```bash
py -m venv env
```
3. Install dependencies:
```bash
pip install flask
pip install tranformers
pip install youtube-transcript-api
pip install torch==1.9.0+cu111 torchvision==0.10.0+cu111 torchaudio==0.9.0 -f https://download.pytorch.org/whl/torch_stable.html
```
### Run the application:
```bash
./env/Scripts/activate
```
```bash
python run.py
```

4. Youtube Data API:
You will need to obtain an API key from https://developers.google.com/youtube/v3

### Input the API key into a .env file
```bash 
YOUTUBE_API_KEY="YOUR_API_KEY"
```

Access the application in your browser at http://localhost:5000.

## Usage
1) Enter a YouTube video link in the input field.
2) Click the "Summarize" button to generate the transcript and summary.
3) The original transcript and its summarized version will be displayed side by side.
4) Users can then copy the transcript

## Technologies Used
- Python
- Flask
- HTML/CSS
- JavaScript
- Tailwind CSS
- AJAX

## Acknowledgments

This project utilizes the following APIs:

- **Hugging Face Transformers:** Used for text summarization. [Link](https://huggingface.co/transformers/)
- **YouTube Transcript API:** Accesses YouTube video transcripts. [Link](https://pypi.org/project/youtube-transcript-api/)
- **PyTorch and TorchVision:** Machine learning frameworks used in the summarization model. [Link](https://pytorch.org/)

This project utilizes the following libraries:
- time
- requests
- os
- dotenv
- flask

## Demo
<img src="https://github.com/Hytherist/Transcript-Summarizer/blob/main/app/showcase/Demo%20Youtube%20Transcript.png?raw=true" alt="alttext" width="600">
