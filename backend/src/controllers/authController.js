import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "devraj_secret"; // later move to .env

// 🔹 Register
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Register error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "admin@gmail.com" && password === "123456") {
      const token = jwt.sign({ id: "admin_test" }, SECRET, {
        expiresIn: "1d",
      });

      return res.json({ token });
    }

    // 🔹 Normal DB Login
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login error" });
  }
};
