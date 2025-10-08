# 🎓 University Course Aggregator — MYUNICAMP Finalist Technical Assessment

A fullstack mini-portal that aggregates university courses in a structured, student-friendly interface.  
This project was built as part of the **MYUNICAMP Fullstack Engineer finalist assessment**.

---

## 🏗️ Overview

The system simulates a small-scale version of the MYUNICAMP platform that connects **students, universities, and agencies**.  

It allows users to:

- Browse available university courses  
- Filter by university, department, or location  
- Compare multiple courses side-by-side  
- View course details, including tuition and requirements  
- Manage course data through a simple **Admin Panel**

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Vite) + TailwindCSS |
| **Backend** | FastAPI + SQLAlchemy + SQLite |
| **Language** | Python 3.13, JavaScript (ES6) |
| **API Client** | Axios |
| **Database ORM** | SQLAlchemy |
| **Deployment-Ready** | FastAPI serves built React app from `/frontend/dist` |

---

## 🧩 Features

| Feature | Description |
|----------|-------------|
| 🧠 **Course Listing** | Displays courses with title, university, duration, and fees. |
| 🔍 **Search & Filters** | Filter by university, department, location, or keywords. |
| 🧾 **Course Details** | Shows full course info including tuition & requirements. |
| 📊 **Dashboard Summary** | Displays total courses, universities, and departments. |
| ⚖️ **Comparison Panel** | Compare selected courses side-by-side in a scrollable table. |
| 🛠️ **Admin Panel** | Add, edit, or delete courses (localStorage + backend POST). |
| 💾 **Local Caching** | Stores fetched data in `localStorage` for fast reloads. |
| ⚡ **Error Handling** | Graceful fallbacks for empty or failed API responses. |
| 📱 **Responsive Design** | Works seamlessly across devices. |

---

## 🧠 System Architecture
repo/
├── backend/
│ ├── main.py
│ ├── scraper.py
│ ├── database/
│ │ ├── models.py
│ │ ├── schemas.py
│ │ ├── crud.py
│ │ └── database.py
│ └── requirements.txt
│
├── frontend/
│ ├── dist/ # ⚡ Production build served by FastAPI
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ └── vite.config.js
└── README.md


---

## 🧩 Backend API Design (FastAPI)

### Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/courses` | List all courses (supports filters) |
| `GET` | `/api/courses/{id}` | Get a single course detail |
| `POST` | `/api/courses` | Add a new course |
| `GET` | `/api/universities` | List all universities |
| `GET` | `/api/departments` | List all departments |
| `POST` | `/api/refresh/biological-sciences` | Trigger background scraper |

### Query Parameters (for `/api/courses`)
- `title`: Filter by course title  
- `university_id`: Filter by university  
- `department_id`: Filter by department  
- `location`: Filter by location  
- `duration`: Filter by course duration  

---

## 🧱 Frontend Pages

| Route | Description |
|--------|-------------|
| `/` | Main course listing + search & filter |
| `/course/:id` | Individual course detail page |
| `/admin` | Admin panel for managing courses |

The frontend communicates directly with the backend API using Axios.  
Data fetched from `/api/courses`, `/api/universities`, and `/api/departments` is also cached in `localStorage` to improve performance and feed the dashboard summary.

---

## 💡 Advanced (Bonus) Features Implemented

| Bonus | Implementation |
|-------|----------------|
| 🔎 **Search & Filter** | Real-time filtering using query parameters |
| ⚖️ **Course Comparison** | Scrollable panel showing selected courses side-by-side |
| 🧮 **Dashboard Summary** | Live totals of courses, departments, and universities |
| 🛠️ **Admin Panel** | Add / Edit / Delete courses (POST API + local caching) |
| 📄 **Pagination Support** | Skip & limit implemented in `/api/courses` |
| ⚠️ **Error Handling & Empty States** | Friendly messages and fallback UIs |
| 📡 **Live Data Scraper** | Background task to pull real course data from University of Southampton |

---

## 🧰 Local Setup Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/myunicamp-aggregator.git
cd myunicamp-aggregator
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run build
```
Ensure your FastAPI main.py is serving from:

```python
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")
```

Then, simply visit:
```bash
http://localhost:8001/
```
✅ The backend serves both the API and the frontend build under a single origin.

### 📊 Example Workflow

- 1️⃣ Start backend server (uvicorn main:app --reload --port 8001)
- 2️⃣ Visit /admin → Add a new course
- 3️⃣ Return to / → See it listed instantly
- 4️⃣ Filter or search by department/university
- 5️⃣ Select multiple → Compare side-by-side
- 6️⃣ Clear filters → Fetch full course list again

## 🏁 Conclusion

- This project demonstrates a complete, production-style fullstack architecture for a course aggregator portal, showcasing:
- Backend data modeling and API design
- Frontend integration with dynamic filters and caching
- Clean, responsive UI/UX without external dependencies
- Bonus features fully implemented (search, comparison, admin CRUD, etc.)

### 💬 Author

**Joshua Fakson**
Fullstack Developer | Focused on scalable backend systems and creative frontend design.