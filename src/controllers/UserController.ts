import { Request, Response} from 'express';

import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

export default {

  //Auth 

  async auth(req: Request, res: Response) {
    const { matricula, password } = req.body; 

    try {
      const getUserPassword = await prisma.user.findUnique({
        where: {
          matricula: matricula,
        },
        select: {
          password: true,
        }
      });
      
      const match = await bcrypt.compare(password, getUserPassword.password);

      if (match) {       
        const user: User = await prisma.user.findFirst({
          where: {
            matricula: matricula
          }
        });

        delete user.password;

        const jwtKey = process.env.JWT_SECRET;
        const jwtExpirySeconds = 60 * 60 * 24 * 7; //7 days

        const token = jwt.sign({ matricula }, jwtKey, {
          algorithm: "HS256",
          expiresIn: jwtExpirySeconds,
        });

        return res.status(200).json({
          user: user,
          token: token,
          expires_in: jwtExpirySeconds,
        });
      }
      else {
        return res.status(404).json('User not found.')
      }
    } catch (error) {
      return res.status(404).json(error);
    }
  },

  
  // Get all Users

  async gelUsers(req: Request, res: Response) {
    try {
      let users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json(error);
    }
  }, 
  

  // Create User

  async createUser(req: Request, res: Response) {

    const {matricula, password, firstName, lastName, email, photoUrl} = req.body;

    const schema = Joi.object({
      matricula: Joi.string().min(3).required(),
      password: Joi.string().min(3).required(),
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(5).required(),
      email: Joi.string().email({ minDomainSegments: 2 }),
      photoUrl: Joi.string(),
    });

    try {
      const users = await prisma.user.create({
        data: {
          matricula: matricula,
          password: password,
          firstName: firstName,
          lastName: lastName,
          email: email,
          photoUrl: photoUrl,
        }
      });

      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json(error);
    }
  }, 


  // Update User

  async updateUser(req: Request, res: Response) {
    const {matricula, password, firstName, lastName, email, photoUrl} = req.body;
    const {matricula: matriculaParam} = req.params;

    try {
      let user =  await prisma.user.findUnique({
        where: {
          matricula: matriculaParam,
        }
      });

      if (!user) return res.json("User not found.")

      user = await prisma.user.update({
        where: {
          matricula: matriculaParam
        },
        data: {
          matricula: matricula,
          firstName: firstName,
          lastName: lastName,
          email: email,
          photoUrl: photoUrl,
        }
      });

      delete user.password;

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json(error);
    }
  }, 


  // Delete User

  async deleteUser(req: Request, res: Response) {
    const {matricula: matriculaParam} = req.params;

    try {
      let user =  await prisma.user.findUnique({
        where: {
          matricula: matriculaParam,
        }
      });

      if (!user) return res.json("User not found.")

      user = await prisma.user.delete({
        where: {
          matricula: matriculaParam
        },
      });

      delete user.password;

      return res.status(200).json({});
    } catch (error) {
      return res.status(400).json(error);
    }
  }, 

};