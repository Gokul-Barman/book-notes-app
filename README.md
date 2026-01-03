📖 Personal Book Notes App
A full-stack web application designed for book lovers to track, rate, and review their reading journey. This project demonstrates a complete CRUD (Create, Read, Update, Delete) workflow, secure user authentication, and integration with third-party APIs.

🚀 Live Demo
Frontend: https://book-notes-app-drab.vercel.app

Backend API: https://openlibrary.org/

✨ Features
User Authentication: Secure Sign-up and Login using JWT (JSON Web Tokens) and password hashing.

Book Management: Add books with titles, personal ratings, and detailed reviews.

Automated Book Covers: Automatically fetches high-quality book covers using the Open Library API.

Persistent Storage: Data is stored securely in a cloud-hosted PostgreSQL database.

Responsive Design: Fully functional on mobile, tablet, and desktop views.

Secure API: Implemented CORS policies and Environment Variables to protect sensitive data.

🛠️ Tech Stack
Frontend
React.js (Vite)

Axios (Centralized API client with interceptors)

CSS3 (Custom styling with a focus on UX)

Backend
Node.js & Express

PostgreSQL (Database)

node-postgres (pg) (Database driver)

Bcrypt.js (Password encryption)

Deployment & Tools
Vercel: Frontend hosting

Render: Backend hosting

Supabase: Cloud PostgreSQL hosting

GitHub: Version control and CI/CD

🏗️ Architecture
The app follows a distributed architecture to ensure scalability and separation of concerns:

Client: React handles the UI and state.

Server: Express processes logic and handles authentication.

Database: A managed PostgreSQL instance ensures data persistence.

🔧 Local Setup
Clone the repository:

Bash

git clone https://github.com/yourusername/book-notes-app.git
Setup Backend:

Navigate to /backend.

Run npm install.

Create a .env file and add:

Code snippet

DATABASE_URL=postgresql://postgres:password@localhost:5432/your_db
JWT_SECRET=your_secret_key
NODE_ENV=development
Run npm run dev.

Setup Frontend:

Navigate to /frontend.

Run npm install.

Create a .env file and add:

Code snippet

VITE_API_BASE_URL=http://localhost:5000
Run npm run dev.

📝 Future Improvements
Add a "Search" functionality for the personal library.

Implement social sharing for book reviews.

Add a "Reading Goals" tracker.

📬 Contact
www.linkedin.com/in/gokul-barman-23556325b

