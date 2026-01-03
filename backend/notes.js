import { Router } from 'express';
import pool from './db.js';
import axios from 'axios';

const router = Router(); 
// Create a new note
router.post("/", async (req,res) => {
    try {
        const userId = req.user?.id; // optional chaining to get user id from auth middleware
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const { title, review, rating, read_date, cover_url } = req.body;
        const newNote = await pool.query(
            "INSERT INTO book_notes (user_id, title, review, rating, read_date, cover_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [userId, title, review, rating, read_date, cover_url]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get all notes with optional sorting
router.get("/", async (req,res) => {
    try {
        const {sort} = req.query;
        // set the default sorting (most recently added)
        let orderBy = "created_at DESC";

        // change the orderby close based on users query
        if (sort === "rating") {
            orderBy = "rating DESC"
        } else if (sort === "recency") {
            orderBy = "read_date DESC"
        }

        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const allNotes = await pool.query(
            `SELECT id, title, cover_url, review, rating, read_date FROM book_notes WHERE user_id = $1 ORDER BY ${orderBy}`,
            [userId]
        );
        res.json(allNotes.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

// edit a note
router.put("/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const userId = req.user?.id;
        const { title, review, rating, read_date} = req.body;
        const updateNote = await pool.query(
            "UPDATE book_notes SET title = $1, review = $2, rating = $3, read_date = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
            [title, review, rating, read_date, id, userId]
        );
        if (updateNote.rows.length === 0) return res.status(404).json({ error: 'Note not found' });
        res.json({
            message: "Note updated",
            note: updateNote.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// delete a note
router.delete("/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const userId = req.user?.id;
        const del = await pool.query("DELETE FROM book_notes WHERE id = $1 AND user_id = $2 RETURNING *",[id, userId]);
        if (del.rows.length === 0) return res.status(404).json({ error: 'Note not found' });
        res.json({message: "Note deleted"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Search for book cover (proxy to OpenLibrary, no CORS issues)
router.get("/cover-search", async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) return res.status(400).json({ error: 'title required' });
        
        console.log("Searching for book cover:", title);
        const response = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
        
        console.log("OpenLibrary response docs count:", response.data.docs?.length);
        if (response.data.docs && response.data.docs.length > 0) {
            const coverId = response.data.docs[0].cover_i;
            console.log("Cover ID found:", coverId);
            if (coverId) {
                const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
                console.log("Returning cover URL:", coverUrl);
                return res.json({ coverUrl });
            }
        }
        console.log("No cover found for:", title);
        res.json({ coverUrl: null });
    } catch (err) {
        console.error('Cover search error:', err.message);
        res.json({ coverUrl: null });
    }
});

export default router;