# LearnPilot AI

**An Autonomous Learning & Placement Coach powered by Collaborative AI Agents**

LearnPilot AI is an intelligent multi-agent educational platform that helps students learn, practice coding, prepare for placements, and plan their careers from a single application.

Instead of a standard chatbot, LearnPilot uses a LangGraph-inspired architecture where a central **Personal Tutor Agent** orchestrates a team of specialized agents (Coding Mentor, Quiz Generator, Placement Agent, and Career Guidance) based on the user's ongoing performance.

---

## 🏗️ Architecture

### Multi-Agent Workflow (The "Brain")
1. **AgentState (Memory):** Holds the student's current goal, recent quiz scores, coding reviews, and weak topics.
2. **Coordinator (Personal Tutor Agent):** Reads the state and decides the next execution step (e.g., if weak topics exist, route to Quiz Agent).
3. **Specialist Agents:** Execute specific tasks (evaluate code, generate mock interviews) and append feedback back to the `AgentState`.
4. **Vector Store (ChromaDB):** Embeds long-term historical data for personalized RAG (Retrieval-Augmented Generation).

### Tech Stack
*   **Frontend:** React (Vite), Tailwind CSS, Framer Motion, React Router, Lucide Icons.
*   **Backend:** Spring Boot 3, Java 21, Spring Data MongoDB.
*   **Database:** MongoDB (Collections: `students`, `roadmaps`, `quizzes`, `interviews`, `agent_memory`, etc.).
*   **AI Integration:** Simulated LangGraph Engine implemented in Java (`workflow/LangGraphEngine.java`), preparing for LangChain4j and Grok LLM integration.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v20+)
*   Java 21
*   Maven
*   MongoDB (running locally or via Docker)
*   Docker & Docker Compose (optional, for full stack deployment)

### Option 1: Running via Docker Compose
To spin up the database, frontend, and backend simultaneously:
\`\`\`bash
docker-compose up --build
\`\`\`
*   Frontend will be available at: `http://localhost:5173`
*   Backend API will be available at: `http://localhost:8080`
*   MongoDB will be available at: `localhost:27017`

### Option 2: Running Locally

**1. Database**
Ensure MongoDB is running on `localhost:27017`.

**2. Backend**
\`\`\`bash
cd backend
./mvnw spring-boot:run
\`\`\`

**3. Frontend**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

---

## 📂 Project Structure

\`\`\`
LearnPilot-AI/
├── docker-compose.yml
├── README.md
├── frontend/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vercel.json           # Vercel deployment config
│   └── src/
│       ├── App.jsx           # Routing definition
│       ├── index.css         # Tailwind directives
│       ├── layouts/          # Dashboard wrapper
│       └── pages/            # React UI components (Dashboard, Coding, Quizzes, etc.)
└── backend/
    ├── Dockerfile            # Render deployment config
    ├── pom.xml
    └── src/main/java/com/example/demo/
        ├── agent/            # AI Agent implementations (Tutor, Coding, Quiz, Placement, Career)
        ├── workflow/         # LangGraph-style state machine (AgentState, LangGraphEngine)
        ├── controller/       # REST API endpoints
        ├── entity/           # MongoDB domain models
        ├── repository/       # Data access layer
        ├── service/          # Business logic
        ├── memory/           # Agent short-term memory schemas
        └── vector/           # ChromaDB/RAG configuration
\`\`\`

---

## ☁️ Deployment Guidelines

*   **Frontend (Vercel):** The `frontend/` directory contains a `vercel.json` configured for SPA routing. Connect your GitHub repository to Vercel and set the root directory to `frontend`.
*   **Backend (Render/AWS):** The `backend/` directory contains a `Dockerfile`. You can deploy this to Render by creating a new Web Service using Docker. Ensure you set the `SPRING_DATA_MONGODB_URI` environment variable to your production MongoDB Atlas cluster.
*   **Database (MongoDB Atlas):** Create a free tier cluster and whitelist your backend's IP address.

---

## 🧪 Testing

1.  **Frontend Routing:** Verify all sidebar links inside the dashboard navigate without full page reloads.
2.  **API Integration:** Use tools like Postman to hit the `http://localhost:8080/api/v1/` endpoints.
3.  **Agent Workflow Logic:** Review the Spring Boot console logs. You should see logs like `[INFO] Workflow Routing: Coordinator decided next node -> PlacementAgent`, proving the autonomous engine is functioning.
