const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Database connection
const pool = new Pool({
    user: 'yoochan',
    host: 'localhost',
    database: 'yoobook_db',
    password: '121202', 
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, ''))); // semua file HTML & assets di root

// ====== REGISTER ======
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// ====== LOGIN ======
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// ====== CONTACT ======
app.post('/contacts', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message } = req.body;

        const result = await pool.query(
            'INSERT INTO contacts (first_name, last_name, email, phone, subject, message) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [firstName, lastName, email, phone, subject, message]
        );

        res.json({ success: true, contact: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// ====== START SERVER ======
app.listen(PORT, () => {
    console.log(`YooBook server running on http://localhost:${PORT}`);
});
