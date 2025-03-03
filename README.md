# Transcript-Summarizer

This web application summarizes YouTube video transcripts using AI-powered models, allowing users to quickly grasp key points without watching entire videos.

## Features
- **Transcript Summarization:** Input a YouTube video link and receive a concise summary.
- **Real-time Status Updates:** Users see a loading indicator while the summarization is in progress.
- **Word Count Display:** Compare the length of the original transcript and the generated summary.
- **Multiple Summarizations:** Summarize multiple YouTube links consecutively.
- **Copy to Clipboard:** Easily copy the transcript and summarized text.
- **Execution Time Display:** View the time taken for the summarization process.

## Technologies Used
- **Backend:** Python, Flask
- **Frontend:** HTML, CSS, JavaScript, Tailwind CSS
- **APIs & Libraries:**
  - Hugging Face Transformers (for text summarization)
  - YouTube Transcript API (for retrieving transcripts)
  - PyTorch (for deep learning models)

## Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/Transcript-Summarizer.git
cd Transcript-Summarizer
```

### 2️⃣ Create a Virtual Environment (Recommended)
```sh
python -m venv env
```

### 3️⃣ Activate the Virtual Environment
- **Windows (CMD):**
  ```sh
  env\Scripts\activate
  ```
- **Mac/Linux:**
  ```sh
  source env/bin/activate
  ```

### 4️⃣ Install Dependencies
```sh
pip install --upgrade pip
pip install flask transformers youtube-transcript-api torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install python-dotenv
```

### 5️⃣ Set Up YouTube API Key
This application requires a YouTube Data API key to fetch video transcripts.

1. Obtain an API key from [Google Developers Console](https://developers.google.com/youtube/registering_an_application).
2. Create a **`.env`** file in the root of your project and add:
   ```sh
   YOUTUBE_API_KEY="YOUR_API_KEY"
   ```
   Replace `YOUR_API_KEY` with your actual API key.

### 6️⃣ Run the Application
```sh
python run.py
```

The application will be available at:
```
http://localhost:5000
```

## Usage
1. Enter a YouTube video link.
2. Click the **Summarize** button.
3. The original transcript and its summarized version will be displayed.
4. Copy the text if needed.

## Acknowledgments
- **Hugging Face Transformers** for text summarization
- **YouTube Transcript API** for fetching transcripts
- **Flask** for the web framework

---
**Enjoy fast and easy YouTube transcript summarization! 🚀**

