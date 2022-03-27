import { Router } from "express";

import UserController from "./controllers/UserController";

const router = Router();

// User

router.post('/auth', UserController.auth);
router.get('/users', UserController.gelUsers);

export { router };