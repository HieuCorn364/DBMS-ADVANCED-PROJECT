const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { Username, Email, Password, FullName } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = new User({
      Username,
      Email,
      Password: hashedPassword,
      FullName,
      Role: 'Student'
    });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ Email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.Role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.json({ token, user: { Username: user.Username, FullName: user.FullName, Role: user.Role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;