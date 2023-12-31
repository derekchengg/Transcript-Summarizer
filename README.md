# Transcript-Summarizer

This web application summarizes YouTube video transcripts using AI-powered models.

## Features

- **Transcript Summarization:** Enter a YouTube video link and get a summarized transcript.
- **Word Count Display:** Display total word count and summary word count.

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
## Run the application:
```bash
./env/Scripts/activate
```
```bash
python run.py
```
Access the application in your browser at http://localhost:5000.

## Usage
1) Enter a YouTube video link in the input field.
2) Click the "Submit" button to generate the transcript and summary.
3) The original transcript and its summarized version will be displayed side by side.

## Technologies Used
- Python
- Flask
- HTML/CSS
- JavaScript

## Acknowledgments

This project utilizes the following APIs and resources:

- **Hugging Face Transformers:** Used for text summarization. [Link](https://huggingface.co/transformers/)
- **YouTube Transcript API:** Accesses YouTube video transcripts. [Link](https://pypi.org/project/youtube-transcript-api/)
- **PyTorch and TorchVision:** Machine learning frameworks used in the summarization model. [Link](https://pytorch.org/)

## Upcoming Features

- Copy to clipboard
- Visibility of Status
