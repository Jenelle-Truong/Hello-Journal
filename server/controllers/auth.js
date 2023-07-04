import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// function to register new users 
export const register = async(req, res) => {
    try {
        const {
            displayName,
            email, 
            password
        } = req.body

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)
        const newUser = new User({
            displayName, 
            email, 
            password: passwordHash
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// function for user login
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const registeredUser = await User.findOne({ email: email });
        if (!registeredUser) return res.status(400).json({ msg: "User does not exist." });

        const isMatch = await bcrypt.compare(password, registeredUser.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: registeredUser._id }, process.env.JWT_SECRET);
        delete registeredUser.password
        res.status(200).json({ token, registeredUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}