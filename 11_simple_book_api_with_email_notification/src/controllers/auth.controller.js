const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const signinSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required()
});

exports.signup = async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
};

exports.signin = async (req, res) => {
  const { error } = signinSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { identifier, password } = req.body;
  const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
};
