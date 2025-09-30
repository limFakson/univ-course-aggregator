# University Course Aggregator MiniPortal

This project is a **fullstack mini-application** built as part of the MYUNICAMP recruitment process. It aggregates and displays university course information in a clean and structured format.

The project has **two main directories**:

* `frontend/` → React application
* `backend/` → FastAPI application

When deployed or served locally, the **frontend build (dist)** is added into the backend and served as static files on the root route `/`. This allows the backend to handle both API and UI delivery.

---

## 🚀 Features

* **Frontend (React)**

  * Responsive UI with course listing and detail pages
  * Minimal design (black/white only, no gradients/shadows/rounded edges)
  * Integrated with backend API

* **Backend (FastAPI)**

  * Endpoints:

    * `GET /courses` → list of courses with advanced filters & pagination
    * `GET /courses/{id}` → course details by ID
  * Advanced query filtering (by title, university, location, duration, fees)
  * Pydantic models for structured responses
  * Serves frontend React app from `/`

---

## 🛠️ Tech Stack

* **Frontend**: React + Vite (or CRA)
* **Backend**: FastAPI (Python 3.9+)
* **Package Manager**: npm/yarn for frontend, pip for backend

---

## 📂 Project Structure

```
project-root/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│
└── frontend/
    ├── public/
    ├── dist/
    ├── src/
    ├── package.json
    └── vite.config.js / webpack config
```

---

## ⚡ Running on Local Machine

### 1. Clone the Repository

```bash
git clone <repo-url>
cd project-root
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run build   # builds the React app into dist/
```

This generates a `dist/` directory inside `frontend/`.

### 3. Setup Backend

```bash
cd ../backend
python -m venv venv
source venv/bin/activate   # on macOS/Linux
venv\Scripts\activate      # on Windows

pip install -r requirements.txt
```

If `requirements.txt` does not exist, install manually:

```bash
pip install fastapi uvicorn
```

### 4. Run Backend + Serve Frontend

```bash
uvicorn main:app --reload --port 8000
```

Now open your browser at:

* **Frontend (React UI)** → [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
* **API Docs (Swagger)** → [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🔍 Example API Requests

* `GET /courses` → list all courses
* `GET /courses?title=engineering&university=MIT` → filter courses
* `GET /courses/{id}` → get single course details

---

## 📦 Deployment Notes

For deployment (e.g., Vercel/Render):

1. Always `npm run build` in frontend before deployment.
2. Ensure backend serves the static frontend build from `/`.
3. Adjust CORS in `main.py` if frontend and backend are hosted separately.

---

## 📖 Summary

This setup ensures a **single FastAPI backend** serves both:

* The **React frontend** (built static files)
* The **API endpoints** for course data

Making it easy to run locally or deploy as one package.
