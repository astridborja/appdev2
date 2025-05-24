const express = require('express');
const mongoose = require('mongoose');
const Book = require('./book');
const app = express();
const PORT = 3000;

app.use(express.json());

// 🔌 Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookapi', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// 🏠 Welcome Route
app.get('/', (req, res) => {
  res.send("Simple Book API using Node.js, Express, and MongoDB");
});

// 📚 Get all books
app.get('/api/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// 📖 Get book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// ➕ Add a new book
app.post('/api/books', async (req, res) => {
  try {
    const { title, author } = req.body;
    const newBook = new Book({ title, author });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✏️ Update a book (partial)
app.patch('/api/books/:id', async (req, res) => {
  try {
    const updates = req.body;
    const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(400).json({ message: "Invalid ID or update data" });
  }
});

// 🗑️ Delete a book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
