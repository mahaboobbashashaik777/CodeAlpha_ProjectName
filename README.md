# 🔮 AuraTranslate - Production-Ready Language Translation Tool

AuraTranslate is a premium, feature-rich web application that allows users to translate text across 70+ languages. It features a modern SaaS-inspired glassmorphic user interface (built with React, Tailwind CSS, and Framer Motion) and is backed by a secure Node.js/Express service. It integrates with Google Cloud and Microsoft Translator, while featuring a seamless out-of-the-box public fallback translation service.

---

## ✨ Features

-   **Searchable & Starred Language Dropdowns**: Access 70+ languages easily with favorite starring and recently used caches.
-   **Auto Language Detection**: Source dropdown detects input languages dynamically and displays translation confidence levels.
-   **Text-to-Speech (TTS) Reader**: Built-in speech synthesizer using the browser's Web Speech API with pause, resume, stop, and live speed controls.
-   **Speech-to-Text (STT) Recorder**: Dictate translation text instead of typing using Web Speech Recognition (optimized for Chrome/Edge).
-   **Interactive Drag & Drop**: Drag and drop plain `.txt` files directly into the text editor.
-   **Downloads**: Export your translations as text files (`.txt`) or structured PDF documents (`.pdf`).
-   **Copy-to-Clipboard**: Quick copy button with visual check notifications.
-   **Offline Translation History**: Local Storage-based history sidebar allowing users to search records, delete logs, restore entries, and clear lists.
-   **Dark & Light Modes**: Seamless transition between themes, synced automatically to system preferences.
-   **Keyboard Shortcuts**: Access functions faster using key mappings.
-   **PWA Ready**: Equipped with Web App Manifest and Service Workers for installation and asset caching.
-   **Interactive Swagger Documentation**: Accessible API docs for backend endpoints.

---

## 📁 Folder Structure

```
language-translator/
├── client/                      # Vite + React Frontend
│   ├── public/                  # Static assets & PWA files
│   │   ├── favicon.ico
│   │   ├── manifest.json
│   │   └── sw.js
│   ├── src/                     # React source files
│   │   ├── components/          # Reusable UI widgets
│   │   │   ├── FileUploader.jsx
│   │   │   ├── HistorySidebar.jsx
│   │   │   ├── LanguageSelect.jsx
│   │   │   └── SpeechControls.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx # Light/Dark/System theme context
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.js
│   │   │   └── useSpeechToText.js
│   │   ├── pages/
│   │   │   └── Translator.jsx   # Core translation dashboard
│   │   ├── services/
│   │   │   └── api.js           # Backend Axios instances
│   │   ├── utils/
│   │   │   └── languages.js     # 70+ language definitions
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                      # Express Backend
│   ├── config/                  # App constants & Logger configs
│   │   ├── logger.js
│   │   └── translation.js
│   ├── controllers/
│   │   └── translateController.js
│   ├── middleware/              # Error, limiter, Joi validation rules
│   │   ├── errorMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── validateMiddleware.js
│   ├── routes/
│   │   └── translateRoutes.js
│   ├── services/
│   │   └── translationService.js
│   ├── tests/                   # Jest Integration Tests
│   │   └── translate.test.js
│   ├── server.js
│   └── package.json
├── .env                         # Server environment variables
├── package.json                 # Root script runner workspace
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18 or higher) installed on your system.

### Steps
1.  **Clone or Open the Project Directory**
    ```bash
    cd language-translator
    ```

2.  **Install All Dependencies**
    This command installs packages for the workspace root, Express server, and React client.
    ```bash
    npm run install-all
    ```

3.  **Configure Environment Variables**
    Configure the variables in the `.env` file at the root. The project runs out-of-the-box using the free fallback translator, but you can configure official services below:
    ```env
    PORT=5000
    NODE_ENV=development
    CLIENT_URL=http://localhost:5173

    # (Optional) For official Google/Microsoft translation API integration:
    # GOOGLE_APPLICATION_CREDENTIALS=path/to/google-key.json
    # GOOGLE_PROJECT_ID=your-google-project-id
    # MICROSOFT_TRANSLATOR_KEY=your-microsoft-key
    # MICROSOFT_TRANSLATOR_REGION=your-region
    # PREFERRED_API=google # 'google', 'microsoft', or 'fallback'
    ```

4.  **Run Development Servers**
    Start both backend and frontend concurrently:
    ```bash
    npm run dev
    ```
    -   Frontend: `http://localhost:5173`
    -   Backend API: `http://localhost:5000`

5.  **Verify & Test**
    Run backend Jest integration tests:
    ```bash
    npm run test
    ```

---

## 📖 Swagger API Documentation

Interactive Swagger documentation is available in development mode.
-   Start the server and visit: `http://localhost:5000/api-docs`
-   This provides direct API testing for:
    -   `POST /translate` (Request body: `{ text, source, target }`)
    -   `GET /health` (Response: `{ status, timestamp }`)

---

## 🎹 Keyboard Shortcuts Cheat Sheet

| Action | Shortcut Key |
| :--- | :--- |
| **Translate Text** | `Ctrl + Enter` |
| **Swap Languages** | `Ctrl + Shift + S` |
| **Copy Translation** | `Ctrl + Shift + C` |

---

## 🌐 Deployment Guide

### Backend: Render Deployment
To deploy the Express server on [Render](https://render.com):
1.  Create a new **Web Service** on Render connected to your Git repository.
2.  Set the **Root Directory** to `server`.
3.  Set the **Build Command** to:
    ```bash
    npm install
    ```
4.  Set the **Start Command** to:
    ```bash
    npm start
    ```
5.  Under **Environment Variables**, add the environment keys (e.g. `NODE_ENV=production`, `PORT=10000`, `CLIENT_URL=https://your-frontend.vercel.app`, and translation keys if applicable).

### Frontend: Vercel Deployment
To deploy the Vite React app on [Vercel](https://vercel.com):
1.  Create a new Project on Vercel connected to your Git repository.
2.  Set the **Root Directory** to `client`.
3.  Vite is automatically detected. Keep default Build and Output Settings:
    -   Build Command: `npm run build`
    -   Output Directory: `dist`
4.  Under **Environment Variables**, add:
    -   `VITE_API_URL`: `https://your-backend-render-url.onrender.com/api`
5.  Click **Deploy**.

    ---

    # AI Music Composer (scaffold added)

    This workspace also includes a scaffold for an AI music generation platform named **AI Music Composer**. The scaffold provides:

    - A FastAPI backend at `server/app.py` with a `/api/generate` endpoint.
    - Model training skeleton under `server/models/train.py` using `music21` and TensorFlow.
    - MIDI utilities in `server/utils/midi_utils.py` and a simple generator `server/models/generate.py`.
    - A lightweight React + Tailwind frontend scaffold in `client/src` for generation UI and preview.

    See `server/requirements.txt` and `requirements.txt` for Python dependencies. To run the backend scaffold locally:

    ```powershell
    cd server
    python -m venv .venv
    .\.venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn server.app:app --reload
    ```

    Frontend (Vite):

    ```bash
    cd client
    npm install
    npm run dev
    ```

    This scaffold is intended as a starting point. Replace the placeholder generator with a trained model for production-ready outputs.
