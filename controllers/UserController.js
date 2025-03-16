import bcrypt from "bcrypt";
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { email, fullName, avatarUrl, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email,
            fullName,
            avatarUrl,
            hash,
        });

        const user = await doc.save();

        const token = jwt.sign({ _id: user._id }, "secret123", { expiresIn: "30d" });

        const { hash: _, ...userData } = user.toObject();

        res.json({ userData, token });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Registration failed" });
    }
};

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.hash);

        if (!isValidPass) {
            return res.status(400).send("Password or login is incorrect");
        }

        const token = jwt.sign({ _id: user._id }, "secret123", { expiresIn: "30d" });

        const { hash, ...userData } = user.toObject();

        res.json({ userData, token });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed" });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        const { hash: _, ...userData } = user.toObject();

        res.json(userData);

        res.status(200).json({
            status: "success",
        })
    }
    catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Registration failed" });
    }
}