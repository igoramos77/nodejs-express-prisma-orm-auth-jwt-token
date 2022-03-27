import { Router } from "express";

import UserController from "./controllers/UserController";

const router = Router();

// User

router.post('/auth', UserController.auth);
router.get('/users', UserController.gelUsers);
router.post('/users', UserController.createUser);
router.put('/users/:matricula', UserController.updateUser);
router.delete('/users/:matricula', UserController.deleteUser);

export { router };