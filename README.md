# Gen-AI Interview Report Generator

An AI-powered web application that helps users prepare for interviews by analyzing their resume and job description, generating personalized interview insights, and creating a downloadable PDF report.

## 🚀 Live Demo

- **Frontend:** https://gen-ai-interview-report-nine.vercel.app/
- **Backend API:** https://gen-ai-interview-report-pn3j.vercel.app/

## ✨ Features

- **AI-Powered Interview Preparation:** Generate personalized interview insights using generative AI.
- **Resume Analysis:** Upload a resume in PDF format for analysis.
- **Job Description Matching:** Analyze a resume against a target job description.
- **Personalized Reports:** Generate interview preparation reports based on the provided information.
- **PDF Generation:** Download the generated report as a PDF.
- **User Authentication:** Register and log in securely.
- **Database Integration:** Store application data using MongoDB.

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**AI & Other Tools**
- Google Gemini API
- Puppeteer
- PDF parsing
- JWT Authentication

**Deployment**
- Vercel

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- MongoDB connection string
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/manvi8oct-art/gen-ai-interview-report.git
cd gen-ai-interview-report
```

### 2. Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder values with your own credentials. Never commit your `.env` file or expose API keys in frontend code.

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal and navigate to the frontend directory. Install dependencies:

```bash
npm install
```

Create a `.env` file if required by your frontend configuration and add the backend API URL using the environment variable name expected by your code.

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## 🔐 Security

- Keep API keys and database credentials in environment variables.
- Never commit `.env` files.
- Use strong, unique secrets for authentication.
- Restrict database access to the minimum required permissions.

## 📌 Future Improvements

- More detailed interview feedback.
- Additional interview question categories.
- Improved report formatting.
- Interview history and progress tracking.
- Enhanced error handling and user experience.

## 👩‍💻 Author

**Manvi**

B.Sc. Computer Science Student | Aspiring Software Developer

GitHub: [manvi8oct-art](https://github.com/manvi8oct-art)

---

*Built as a hands-on project to explore generative AI, full-stack development, authentication, PDF generation, and cloud deployment.*
