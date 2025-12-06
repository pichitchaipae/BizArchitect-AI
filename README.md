<div align="center">
  <img width="1200" height="475" alt="BizArchitect AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # BizArchitect AI
  
  **The AI-Powered Business Model Canvas Generator**

  [![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)](https://vitejs.dev/)
  [![Firebase](https://img.shields.io/badge/Firebase-12-orange?logo=firebase)](https://firebase.google.com/)
  [![Gemini](https://img.shields.io/badge/Google%20Gemini-3%20Pro-blue?logo=google)](https://deepmind.google/technologies/gemini/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan?logo=tailwindcss)](https://tailwindcss.com/)

  <p align="center">
    Rapidly prototype, analyze, and refine business ideas with the power of Google Gemini 3 Pro. <br />
    Collaborate in real-time, export professional reports, and turn concepts into concrete plans.
  </p>
</div>

---

## 🚀 Overview

**BizArchitect AI** is a sophisticated Single Page Application (SPA) designed for entrepreneurs, consultants, and business analysts. It leverages the reasoning capabilities of **Google Gemini 3 Pro** to act as an intelligent co-founder, helping users fill out, refine, and validate their Business Model Canvas.

Unlike static templates, BizArchitect AI "thinks" about your business. It suggests revenue streams, identifies key partners, and challenges your assumptions—all while syncing data in real-time across devices via **Firebase**.

## ✨ Key Features

- **🤖 AI Co-Founder:** Chat with a specialized AI persona (Startup Builder, Enterprise Architect, etc.) to brainstorm and refine your business model.
- **📊 Dynamic Business Canvas:** Automatically populates a 9-grid Business Model Canvas based on your conversation.
- **⚡ Real-Time Sync:** Powered by Firebase Firestore, changes are instantly reflected across all connected devices.
- **🎨 Smart Visualization:** Color-coded blocks indicate validation status (Assumed vs. Validated).
- **Cc Export Capabilities:** Generate professional PDF, Word (DOCX), and Markdown reports in one click.
- **🔐 Secure Authentication:** Enterprise-grade Google Sign-In integration.

## 🛠️ Tech Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React 19, TypeScript | Modern, type-safe UI library. |
| **Build Tool** | Vite | Lightning-fast HMR and bundling. |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework. |
| **Routing** | React Router v7 | Client-side navigation. |
| **Backend** | Firebase (Serverless) | Auth, Firestore (NoSQL), and Hosting. |
| **AI Model** | Google Gemini 3 Pro | Multimodal reasoning and content generation. |

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- A **Google Cloud / Firebase** Project
- A **Google AI Studio** API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bizarchitect-ai.git
   cd bizarchitect-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory. You can copy the structure below:

   ```env
   # Firebase Configuration (Get these from Firebase Console > Project Settings)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Google AI Studio Key (Get this from aistudio.google.com)
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The app should now be running at `http://localhost:3000` (or similar).

---

## 🏗️ Project Architecture

### File Structure
```
/
├── index.html              # Entry point
├── App.tsx                 # Main Router & Auth Provider
├── .env                    # Environment Variables (GitIgnored)
│
├── services/               # LOGIC LAYER
│   ├── firebase.ts         # Firebase Config & Initialization
│   └── geminiService.ts    # AI Interaction Logic & Prompt Engineering
│
└── components/             # UI LAYER
    ├── Dashboard.tsx       # Main State Controller
    ├── ChatInterface.tsx   # AI Chat & Persona Selector
    ├── BusinessCanvas.tsx  # 9-Grid Canvas Renderer
    └── ...
```

### Core Logic Flow

1.  **The Controller (`Dashboard.tsx`):** Manages the global state (`canvas`, `chat`, `user`). It listens to Firestore for real-time updates and orchestrates data flow between the user, the AI, and the database.
2.  **The Brain (`geminiService.ts`):** Constructs dynamic system instructions based on the user's selected "Analyst Role" (e.g., VC, Product Manager). It sends the current canvas state + chat history to Gemini to generate context-aware updates.
3.  **The Cloud (`firebase.ts`):** Handles secure user authentication and persists the canvas state to Firestore, ensuring data is never lost.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
- **Role:** The "Manual Override".
- **Logic:** Allows users to manually edit block content and status.

### 4. Data Flow Example
1. **User Action:** User selects "Startup Builder" role and types "I want to sell cookies online".
2. **State Update:** `ChatInterface` notifies `Dashboard.tsx`.
3. **AI Processing:** `Dashboard.tsx` calls `analyzeBusinessIdea` in `geminiService.ts`.
4. **Prompt Construction:** `geminiService` combines Role, Context, and Stack into a prompt.
5. **Response:** Gemini returns JSON with a new "Channels" block (e.g., "Direct-to-Consumer Website").
6. **UI Update:** `Dashboard.tsx` updates `canvasState`.
7. **Sync:** `Dashboard.tsx` saves the new JSON to Firebase Firestore.
8. **Render:** `BusinessCanvas` re-renders, showing the new block in Yellow (Assumed).
