# Ekbes — AI Career Agent 🚀

**Ekbes** is a powerful AI career companion designed to empower Tunisian students and job seekers. It bridges the gap between university education and market requirements by providing automated CV optimization, personalized job matching, and a gamified skill-building roadmap.

## 🌟 Key Features

- **✨ Smart CV Optimization**: Automatically refines your CV for ATS (Applicant Tracking Systems) compatibility.
- **📊 ATS Scoring & Feedback**: Detailed breakdown of your profile's alignment with target roles.
- **🌍 Tunisian Job Market Matcher**: Real-time semantic search across a curated dataset of Tunisian job postings using RAG (Retrieval-Augmented Generation).
- **📅 Dynamic Action Plan**: A personalized "Quest Checklist" to bridge skill gaps, with live CV updates as you progress.
- **✉️ AI-Powered Applications**: One-click professional email generation and automated sending via **n8n**.
- **🎮 Gamified Career Growth**: Earn XP and level up as you complete tasks and apply for jobs.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + Custom Syne/Outfit Typography
- **State Management**: React Hooks + Custom `useAgent` hook
- **Streaming**: Server-Sent Events (SSE) for real-time AI reasoning feedback

### Backend
- **Framework**: FastAPI (Python)
- **Agent Orchestration**: **LangGraph** (by LangChain)
- **LLM**: **Groq** (llama-3.3-70b-versatile) for ultra-fast inference
- **Vector Search**: FAISS (Facebook AI Similarity Search)
- **Data**: Curated Tunisian Job Market dataset (CSV)

### Automation
- **Workflow**: n8n (Cloud/Self-hosted) for Gmail application delivery

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Groq API Key
- n8n instance (Cloud or Local)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend/` folder:
   ```env
   GROQ_API_KEY=your_groq_key_here
   N8N_WEBHOOK_URL=your_n8n_webhook_url_here
   ```
4. Run the API server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Demo

1. **Intake**: Paste your CV and set your job preferences (e.g., "Frontend Developer" in "Tunis").
2. **Analysis**: Watch the 8-node LangGraph pipeline analyze your profile in real-time.
3. **Optimized CV**: Compare your original CV with the AI-optimized version in the **ATS Report** tab.
4. **Job Search**: View top 5 semantic matches with "Match Resonance" scores and reasoning.
5. **Action Plan**: Check off a "Quest" (like adding a skill). Watch your XP grow and your optimized CV update live!
6. **Apply**: Generate a French application email and click **"Send via n8n"** to trigger the automated workflow.

---

Built with ❤️ for the **Innovara Hackathon**.