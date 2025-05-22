const User = require('../models/user');
const bcrypt = require('bcrypt');
const { generateTokens } = require('../lib/utils'); 

exports.signup = async (req, res) => {
  const { username, name, email, password } = req.body;

  try {
    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    generateTokens(newUser._id, res);

    res.status(201).json({
      message: "Signup successful",
      _id: newUser._id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async(req, res) =>  {
    const { identifier, password } = req.body;

    if(!identifier || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        generateTokens(user._id, res);

        res.status(200).json({
        message: "Login successful",
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email, 
    });

    } catch(error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}
