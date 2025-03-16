import { body } from "express-validator";

export const loginValidation = [

    body("email", "Некорректный email").isEmail(),

    body("password", "Пароль должен содержать минимум 6 символов").isLength({ min: 6 }),

];

export const registerValidation = [

    body("email", "Некорректный email").isEmail(),

    body("password", "Пароль должен содержать минимум 6 символов").isLength({ min: 6 }),

    body("fullName", "Имя должно содержать минимум 3 символа").isLength({ min: 3 }),

    body("avatarUrl", "Некорректная ссылка на изображение").optional().isURL(),

];

export const postCreateValidation = [

    body("title", "Заголовок должен содержать минимум 3 символа").isLength({ min: 3 }).isString(),

    body("text", "Текст статьи должен содержать минимум 10 символов").isLength({ min: 10 }).isString(),

    body("tags", "Некорректный формат тегов").optional().isString(),

    body("imageUrl", "Некорректная ссылка на изображение").optional().isString(),

];
