const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory book collection
let books = [
    { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien" },
    { id: 2, title: "1984", author: "George Orwell" }
];

// Routes

// Root route
app.get('/', (req, res) => {
    res.send("Simple Book API using Node.js and Express");
});

// Get all books
app.get('/api/books', (req, res) => {
    res.json(books);
});

// Get book by ID
app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
});

// Add new book
app.post('/api/books', (req, res) => {
    const { title, author } = req.body;
    const newBook = {
        id: books.length ? books[books.length - 1].id + 1 : 1,
        title,
        author
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

// Update book
app.patch('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    const { title, author } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    res.json(book);
});

// Delete book
app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === bookId);
    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }
    books.splice(index, 1);
    res.json({ message: "Book deleted successfully" });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});