import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";

import UserController from "./controllers/UserController";

const router = Router();

const userController = new UserController();


//Auth

router.post('/auth', userController.auth);


// User

router.get('/users', userController.getUsers);
router.post('/users', celebrate({
  [Segments.BODY]: {
      matricula: Joi.string().min(3).required(),
      password: Joi.string().min(3).required(),
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(5).required(),
      email: Joi.string().email({ minDomainSegments: 2 }),
      photoUrl: Joi.string(),
  }
}), userController.createUser);
router.put('/users/:matricula', userController.updateUser);
router.delete('/users/:matricula', userController.deleteUser);

export { router };