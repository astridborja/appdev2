require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

// Import your models
const User = require('../src/models/user.model');
const Book = require('../src/models/book.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  seedData();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

async function seedData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('🧹 Cleared users and books collections');

    // Create fake users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = new User({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: hashedPassword
      });
      users.push(await user.save());
    }
    console.log('👤 Created 5 users');

    // Create fake books (each linked to a user)
    for (let i = 0; i < 10; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const book = new Book({
        title: faker.lorem.words(3),
        author: faker.name.fullName(),
        year: faker.date.past().getFullYear(),
        userId: randomUser._id // optional if Book model supports it
      });
      await book.save();
    }
    console.log('📚 Created 10 books');

    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}
