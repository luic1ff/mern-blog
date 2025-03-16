import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from "./validations.js";

import {UserController , PostController} from "./controllers/index.js";

import {checkAuth, handleValidationErrors} from "./utils/index.js";

mongoose.connect("mongodb://localhost:27017/blog")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static("uploads"));

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.post("/login", loginValidation , handleValidationErrors ,UserController.login);

app.post("/register", registerValidation, handleValidationErrors ,UserController.register);

app.get("/me", checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) =>{

    res.json({

        url: ('/uploads/' + req.file.originalname),
    });
});

app.get("/posts", PostController.getAll);

app.get("/posts/:id", PostController.getOne);

app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors ,PostController.create);

app.delete("/posts/:id", checkAuth, PostController.remove);

app.patch("/posts/:id", postCreateValidation, handleValidationErrors ,PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.error("Server error:", err);
    }
    console.log("Server running on port: 4444");
});
