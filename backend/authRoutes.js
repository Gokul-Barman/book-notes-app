import { Router } from 'express';
import pool from './db.js';
import bcrypt from 'bcrypt';
import { generateToken, authMiddleware } from './auth.js';
import crypto from 'crypto';

const router = Router();

// Get current user (verify token)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT id, username FROM users WHERE id = $1', [req.user.id]);
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(userRes.rows[0]); // Returns {id, username}
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
  

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'username taken' });

    const id = crypto.randomUUID();
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (id, username, password_hash) VALUES ($1, $2, $3)', [id, username, hash]);
    const token = generateToken({ id, username });
    res.json({ token, user: { id, username } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login existing user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const userRes = await pool.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);
    if (userRes.rows.length === 0) return res.status(401).json({ error: 'invalid credentials' });

    const user = userRes.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const token = generateToken({ id: user.id, username: user.username });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
