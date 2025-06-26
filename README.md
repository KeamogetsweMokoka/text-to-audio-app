# 🗣️ Text-to-Audio Web App

This is a modern web application that allows users to upload document files (PDF, DOCX, TXT) and convert the text into speech using **Amazon Polly**, with the ability to play, pause, resume, and download the generated audio as an `.mp3` file.

---

## 🎯 Features

- ✅ Drag-and-drop file upload (PDF, DOCX, TXT)
- ✅ Automatic text extraction
- ✅ Text-to-Speech (TTS) using Amazon Polly
- ✅ Audio playback controls (play, pause, resume, stop)
- ✅ Audio download as `.mp3`
- ✅ Clean, responsive UI built with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- React Dropzone
- Axios
- HTML5 Audio API

### Backend
- Node.js + Express
- Multer (file uploads)
- pdf-parse, mammoth (text extraction)
- AWS SDK (Polly)
- dotenv

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/text-to-audio-app.git
cd text-to-audio-app

*** 2. Backend Setip (Server) ***

cd server
npm install

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

npm run dev


*** 3. Frontend Setup ***

cd ../client
npm install
npm start

📦 Dependencies to Install
Server
bash
Copy
Edit
npm install express multer cors pdf-parse mammoth aws-sdk dotenv
npm install --save-dev nodemon
Client
bash
Copy
Edit
npm install axios react-dropzone
🎧 Voice Settings
This project uses Amazon Polly voice: Joanna (US English).
You can change it in /server/index.js:

js
Copy
Edit
VoiceId: 'Joanna' // Change to: Matthew, Ivy, Brian, etc.


✅ To-Do / Future Ideas
 User authentication (save uploaded files per user)

 Add support for EPUB files (books)

 Voice selection in frontend

 Store and stream audio from AWS S3

 Add progress bar for long documents

👤 Author
Kgabo

GitHub: @your-github-username

Project: Text-to-Audio Web App

📄 License