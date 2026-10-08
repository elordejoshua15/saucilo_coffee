const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors'); // 1. Require cors
const mysql = require('mysql2/promise'); // Import mysql2 promise wrapper
const bcrypt = require('bcrypt'); // Import bcrypt

// Create the connection pool to your MySQL database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL password
    database: 'db1',  // Replace with your database name
    waitForConnections: true,
    connectionLimit: 10
});

// 2. Enable CORS for all requests
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(express.static('public'))
// Mock database
let items = [
    { id: 1, name: 'Item One' },
    { id: 2, name: 'Item Two' }
];

// GET: Fetch all items
app.get('/api/items', (req, res) => {
    res.status(200).json(items);
});

// GET: Fetch a single item by ID
app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
});

// POST: Create a new item
app.post('/api/items', (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    const newItem = {
        id: items.length + 1,
        name: req.body.name
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// PUT: Update an existing item
app.put('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.name = req.body.name || item.name;
    res.status(200).json(item);
});

// DELETE: Remove an item
app.delete('/api/items/:id', (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });

    items.splice(itemIndex, 1);
    res.status(200).json({ message: 'Item deleted successfully' });
});


// Mock database array
let users = [];



// POST: Registration Endpoint with Hashing
app.post('/api/register', async (req, res) => {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // 1. Check if email already exists
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // 2. Hash the password securely (salt rounds = 10)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Insert new user with the hashed password into MySQL
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // 4. Send success response
        res.status(201).json({ 
            message: 'Registration successful!', 
            user: { id: result.insertId, name, email } 
        });

    } catch (error) {
        console.error('Database/Hashing error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
