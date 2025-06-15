require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./src/routes/auth.route');
const bookRoutes = require('./src/routes/book.route');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
