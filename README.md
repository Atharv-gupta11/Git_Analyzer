<div align="center">
  <br />
  <img src="https://via.placeholder.com/1000x300/100000/FFFFFF?text=GitAnalyzer+AI" alt="GitAnalyzer AI Banner" />
  <br />
  <br />

  <b>AI-Powered GitHub Repository Analyzer using Retrieval-Augmented Generation (RAG)</b>

  <br />
  <br />

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![ChromaDB](https://img.shields.io/badge/ChromaDB-FF4F00?style=for-the-badge)](https://www.trychroma.com/)
</div>

---

## 📖 Introduction

**GitAnalyzer AI** is an advanced, AI-powered tool designed to transform the way developers interact with unfamiliar codebases. By leveraging Retrieval-Augmented Generation (RAG), GitAnalyzer bridges the gap between static repositories and interactive, contextual code exploration.

Instead of manually navigating through complex file trees, developers can instantly clone any public repository, generate semantic vector embeddings of its source code, and converse with an AI assistant that intrinsically understands the repository's architecture, dependencies, and business logic.

---

## ✨ Features

- **Automated Repository Ingestion:** Seamlessly clone and parse public GitHub repositories.
- **Semantic Code Chunking:** Intelligently splits source code into context-aware chunks optimized for Large Language Models.
- **ChromaDB Vector Indexing:** Employs `SentenceTransformers` to generate dense vector embeddings for ultra-fast semantic search.
- **Intent-Driven RAG Pipeline:** Contextually understands whether you are asking for architecture overviews, bug detection, or general Q&A.
- **Source Attribution:** AI responses strictly cite the exact files and code blocks used to generate the answer.
- **Automated Code Audits:** Generates comprehensive bugs reports, architecture diagrams, and improvement suggestions instantly.
- **Premium Developer UX:** A highly responsive, command-center style interface inspired by industry-leading developer tools (Cursor, Linear, Vercel).

---

## 🚀 Demo

*(Placeholder for Demo GIF)*
<img src="https://via.placeholder.com/800x450/111111/FFFFFF?text=Demo+GIF+Placeholder" alt="GitAnalyzer Demo" />

---

## 📸 Screenshots

<details>
<summary><b>View Screenshots</b></summary>
<br/>

| Repository Analysis | Contextual AI Chat |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250/222222/FFFFFF?text=Analysis+View" alt="Analysis Dashboard" /> | <img src="https://via.placeholder.com/400x250/222222/FFFFFF?text=AI+Chat+Interface" alt="AI Chat Interface" /> |

</details>

---

## 🏛️ Architecture

GitAnalyzer AI employs a highly modular architecture separating the reactive frontend from the heavy RAG indexing backend.

```ascii
                      +-------------------+
                      |    User Client    |
                      |  (React + Vite)   |
                      +---------+---------+
                                |
                                ↓ REST APIs
                      +---------+---------+
                      |   FastAPI Layer   |
                      |  (Routing & Auth) |
                      +---------+---------+
                                |
             +------------------+------------------+
             |                                     |
             ↓                                     ↓
    +-----------------+                  +-------------------+
    | Repository Sync |                  |    RAG Pipeline   |
    | (Git Clone API) |                  | (LangChain Logic) |
    +--------+--------+                  +---------+---------+
             |                                     |
             ↓                                     ↓
    +-----------------+                  +-------------------+
    | Source Chunker  |                  | Intent Detection  |
    | (AST / Parsers) |                  | (Routing Prompts) |
    +--------+--------+                  +---------+---------+
             |                                     |
             ↓                                     ↓
    +-----------------+                  +-------------------+
    |   Embeddings    |                  |  Context Builder  |
    | (Sentence-Trf)  |<-----------------|  (Vector Search)  |
    +--------+--------+                  +---------+---------+
             |                                     |
             ↓                                     ↓
    +-----------------+                  +-------------------+
    |    ChromaDB     |                  |   LLM Inference   |
    | (Vector Store)  |                  | (Generative Model)|
    +-----------------+                  +-------------------+
```

---

## 🔄 System Workflow

1. **Input:** User submits a GitHub Repository URL.
2. **Clone & Parse:** The backend clones the repository into an ephemeral workspace and parses valid source files (ignoring binaries/assets).
3. **Chunk & Embed:** The source code is semantically chunked. `SentenceTransformers` generate dense vector embeddings.
4. **Vector Storage:** Embeddings and metadata (filepaths, signatures) are stored in ChromaDB.
5. **Query:** User asks a technical question ("How is state managed?").
6. **Intent Detection:** The system detects the query intent to apply specialized prompt templates.
7. **Semantic Search:** ChromaDB returns the top-k most relevant code chunks.
8. **Generation:** The LLM synthesizes the context and generates an accurate, source-attributed answer.

---

## 📂 Folder Structure

```text
Git_Analyzer/
├── backend/
│   ├── chroma_db/            # Persistent local vector storage
│   ├── prompts/              # System prompts & LangChain templates
│   ├── repos/                # Ephemeral cloned repositories
│   ├── services/             # Core business logic (chunking, RAG)
│   ├── main.py               # FastAPI entry point
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── client/
│   │   ├── api/              # Axios API clients
│   │   ├── components/       # Reusable React UI components
│   │   ├── context/          # React Context (State Management)
│   │   ├── pages/            # View components
│   │   └── global.css        # Tailwind/Monochrome Theme System
│   ├── tailwind.config.js    # Tailwind layout configuration
│   └── vite.config.js        # Vite bundler configuration
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Component-driven UI)
- **Vite** (Lightning-fast HMR and bundling)
- **TailwindCSS** (Utility-first styling, custom Monochrome theme)
- **Axios** (HTTP client)

### Backend
- **Python 3.10+**
- **FastAPI** (High-performance async API)
- **ChromaDB** (Open-source vector database)
- **SentenceTransformers** (Local embedding generation)
- **LangChain** (LLM orchestration and prompt management)

---

## ⚙️ Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up Environment Variables:
   Create a `.env` file in the `backend` directory.
   ```env
   OPENAI_API_KEY=your_api_key_here
   # Or configure your local LLM inference endpoint
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/repos/clone` | Clones a repository locally for parsing | `{ "url": "https://github.com/..." }` |
| `POST` | `/api/repos/index` | Chunks code and builds the ChromaDB index | `{ "repo_name": "react" }` |
| `GET` | `/api/repos/{name}/stats` | Retrieves embedding and indexing statistics | None |
| `POST` | `/api/chat/query` | Submits a query to the RAG pipeline | `{ "repo": "react", "query": "..." }` |

---

## 🌟 Project Highlights

Unlike standard repository chatbots that rely solely on surface-level text search or blind context-window stuffing, GitAnalyzer AI utilizes **Semantic Source Chunking**. By retaining file-level metadata and applying intent-based routing, the AI distinguishes between architectural questions ("How does the auth flow work?") and bug identification ("Are there memory leaks here?"), providing deterministic and highly accurate responses backed by actual codebase citations.

---

## 🔮 Future Scope (Version 2)

- **Hierarchical Summarization:** Generating folder-level summaries that roll up into an overarching repository architecture document.
- **Hybrid Search Capabilities:** Fusing Keyword Search (BM25) with Vector Search to handle exact variable/function name lookups alongside semantic queries.
- **Context Reranking:** Implementing a Cross-Encoder step to rerank vector results before passing them into the LLM's context window.
- **Knowledge Graph Generation:** Extracting function call hierarchies to visually map dependencies.
- **Repository Metadata Extraction:** Automatically parsing `package.json` / `requirements.txt` to inject high-level dependency context into the RAG pipeline.

---

## 📝 Resume Highlights

*If you are using this project for your portfolio, here are suggested bullet points:*

- Architected a highly scalable Retrieval-Augmented Generation (RAG) system utilizing **FastAPI**, **ChromaDB**, and **SentenceTransformers** to semantically index and query large-scale GitHub repositories.
- Designed a contextual code-chunking pipeline that reduces LLM hallucination and provides deterministic file-level source attribution for AI responses.
- Developed a high-performance, responsive Single Page Application (SPA) using **React**, **Vite**, and **TailwindCSS**, resulting in a premium developer experience inspired by modern developer tools.
- Engineered an intent-detection router leveraging **LangChain** to dynamically shift prompt templates based on user queries (e.g., architecture design vs. bug detection).

---

## 🧠 Challenges Faced & Engineering Decisions

1. **Context Window Limitations:** Stuffing entire files into an LLM often results in truncated responses and "lost in the middle" phenomena. *Solution:* Implemented rigorous semantic chunking with overlapping text to preserve function boundaries, keeping vectors dense and relevant.
2. **LLM Hallucinations:** When queried about non-existent features, the AI would sometimes guess. *Solution:* Strictly configured the RAG pipeline to refuse answering if the similarity search score across ChromaDB fell below a specific threshold, ensuring deterministic behavior.
3. **Frontend Perceived Performance:** Indexing repositories is I/O and compute-heavy, leading to blocked UIs. *Solution:* Shifted to an async-first frontend model. Instead of blocking the UI with loading screens, the app utilizes non-blocking `Skeleton` layouts and subtle header indicators, allowing users to interact with previously indexed data seamlessly.

---

## 📚 Learning Outcomes

- Mastery of the **RAG Architecture Lifecycle**: from ingestion and chunking to embedding and generation.
- Deep understanding of **Vector Databases** (ChromaDB) and the mathematics behind Cosine Similarity search.
- Advanced **Prompt Engineering**, particularly around forcing LLMs to output structured data with citations.
- Delivering **Production-Grade UX** by obsessing over micro-interactions, perceived latency, and responsive component design.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<br />
<div align="center">
  <i>Built with passion for the Open Source community.</i>
</div>
