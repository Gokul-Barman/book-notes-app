import express from 'express';
import cors from "cors";
import notesRoutes from "./notes.js";
import authRoutes from "./authRoutes.js";
import { authMiddleware } from './auth.js';


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: [
    "https://book-notes-app-drab.vercel.app", // live site
    "http://localhost:5173"                       // local computer (Vite)
  ],
  credentials: true
}));
app.use(express.json());

app.use('/auth', authRoutes);

// Protect notes routes
app.use("/notes", authMiddleware, notesRoutes);

app.listen(PORT, '0.0.0.0', () => console.log(`Server on ${PORT}`)); // 0.0.0.0 to accept external connections