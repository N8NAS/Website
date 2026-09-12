# Sanflix - Full-Stack Streaming Platform

**Live Demo:** [sanflix.vercel.app](https://website-kmptnhlpw-n8-nas.vercel.app/)  
**Backend API Docs:** [Sanflix Render API](https://website-2cye.onrender.com/docs)

---

## 1. Project Background & Scope

Sanflix is a comprehensive full-stack web application designed to demonstrate a modern Streaming Platform architecture. Rather than focusing solely on UI cloning, the primary objective of this project is to build a robust, scalable Content Management System (CMS) for media delivery, encompassing secure RESTful API integrations, dynamic data flow, and Role-Based Access Control (RBAC).

**Scope Boundaries:**
This phase strictly focuses on data architecture, secure state management, and content organization (Authentication, Admin Dashboards, User Watchlists, and Viewing History). Complex video streaming algorithms and heavy CDN implementations are deferred to future iterations to prioritize core engineering foundations.

---

## 2. Architecture & Key Features

Sanflix utilizes a modern decoupled architecture, separating the client application from the backend services for maximum scalability and independent deployment cycles.

### Tech Stack
*   **Frontend:** React.js, Vite, Vanilla CSS (Deployed on Vercel)
*   **Backend:** Python, FastAPI, SQLAlchemy, Uvicorn (Deployed on Render)
*   **Database:** MySQL 8 (Hosted on Railway)

### Key Functionalities
*   **Role-Based Access Control (RBAC):** Secure authentication flow differentiating between standard Users and Administrators.
*   **Content Management Dashboard:** Protected admin routes and UI to inject, modify, and manage movie/TV show data directly into the MySQL database.
*   **User Engagement Systems:** Real-time integration of User Watchlists and Viewing History tracking.
*   **Dynamic Media Feeds & Search:** Programmatic generation of categorized feeds (Popular, New Releases) and a dedicated search engine querying the database dynamically.
*   **Cross-Origin Resource Management (CORS):** Fully configured middleware facilitating secure, cross-domain communication between Vercel (Frontend) and Render (Backend).

---

## 3. Technical Challenges & Problem Solving

Building this application involved overcoming several significant engineering hurdles:

*   **The React Blank Screen (SPA Routing) Bug on Vercel:**
    During the frontend deployment, the application experienced 404 errors and blank screens upon manual refresh. I diagnosed this as a Single Page Application (SPA) routing issue. I optimized this by correctly leveraging Vercel's automatic Vite Framework Preset, streamlining the deployment process and ensuring client-side routing behaves as expected on production servers.
*   **Database Connection String Manipulation:**
    Railway provides default MySQL connection strings starting with `mysql://`. However, SQLAlchemy requires a specific driver format (`mysql+pymysql://`) to interface correctly. I implemented a solution in the FastAPI backend to parse and manipulate the environment variable dynamically, ensuring the connection string is always correctly formatted for the ORM regardless of the hosting provider's default output.
*   **Addressing Cold Starts & Latency:**
    Deploying the backend on Render's free tier introduced significant latency during cold starts. To mitigate the perceived performance drop, I ensured the frontend handles loading states gracefully, preventing UI freezing and providing visual feedback to the user while the backend spins up.

---

## 4. Local Setup Instructions

Follow these steps to run the project locally on your machine.

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   A local MySQL server or a Railway Database URL.

### Backend Setup (FastAPI)
1. Clone the repository and navigate to the backend directory:
   ```bash
   cd src/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend` directory and add your database URL:
   ```env
   DATABASE_URL=mysql+pymysql://user:password@localhost:3306/sanflix
   ```
5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The API will be available at http://localhost:8000*

### Frontend Setup (React/Vite)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd src/frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory and define the backend API URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be available at http://localhost:5173*
