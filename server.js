const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'letelemokapela0602', 
    database: 'lerato'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Check Products table
db.query(`CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL
);`, (err) => {
    if (err) console.error('Error creating products table:', err);
    else console.log("Products table is ready.");
});

// Create Product Endpoint
app.post('/products', (req, res) => {
    const { name, category, description, price, quantity } = req.body;
    db.query('INSERT INTO products (name, category, description, price, quantity) VALUES (?, ?, ?, ?, ?)', 
        [name, category, description, price, quantity], 
        (error, results) => {
            if (error) return res.status(500).json({ message: 'Database Error' });
            res.status(201).json({ message: 'Product added successfully', id: results.insertId });
        });
});

// Get Products Endpoint
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (error, results) => {
        if (error) return res.status(500).json({ message: 'Database Error' });
        res.json(results);
    });
});

// Update Product Endpoint
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, description, price, quantity } = req.body;
    db.query('UPDATE products SET name = ?, category = ?, description = ?, price = ?, quantity = ? WHERE id = ?', 
        [name, category, description, price, quantity, id], 
        (error) => {
            if (error) return res.status(500).json({ message: 'Database Error' });
            res.json({ message: 'Product updated successfully' });
        });
});

// Delete Product Endpoint
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (error) => {
        if (error) return res.status(500).json({ message: 'Database Error' });
        res.json({ message: 'Product deleted successfully' });
    });
});

// Check Users table
db.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`, (err) => {
    if (err) console.error('Error creating users table:', err);
    else console.log("Users table is ready.");
});

// Registration endpoint (no password hashing)
app.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    // Insert plain text password into the database
    db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role], (error) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Username already exists' });
            }
            return res.status(500).json({ message: 'Database Error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// Login endpoint 
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) return res.status(500).json({ message: 'Database Error' });
        if (results.length > 0) {
            const user = results[0];
            // Check if the password matches directly (no bcrypt compare)
            if (password === user.password) {
                res.json({ message: 'Login successful', role: user.role });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Get Users Endpoint
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Database Error' });
        }
        res.json(results);
    });
});

// Update User Endpoint
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    let hashedPassword = password;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10); // Hash new password
    }

    db.query('UPDATE users SET username = ?, password = ? WHERE id = ?', 
    [username, hashedPassword, id], 
    (error) => {
        if (error) return res.status(500).json({ message: 'Database Error' });
        res.json({ message: 'User updated successfully' });
    });
});

// Delete User Endpoint
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (error) => {
        if (error) return res.status(500).json({ message: 'Database Error' });
        res.json({ message: 'User deleted successfully' });
    });
});

const PORT = 5400;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));