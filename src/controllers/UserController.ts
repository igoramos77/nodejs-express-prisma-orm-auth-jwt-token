import { Request, Response} from 'express';

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

const jwtKey = process.env.JWT_SECRET;
const jwtExpirySeconds = 60 * 60 * 24 * 7; //7 days


export default {

  //Auth 

  async auth(req: Request, res: Response) {
    const { matricula, password } = req.body; 

    try {
      const userPassword = await prisma.$queryRaw`SELECT password FROM "public"."User" WHERE matricula = ${matricula}`;
      const userPasswordFormatted = userPassword[0].password;

      const token = jwt.sign({ matricula }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
      });
      
      const match = await bcrypt.compare(password, userPasswordFormatted);

      if (match) {       
        const user = await prisma.user.findFirst({
          where: {
            matricula: matricula
          }
        });

        delete user.password;

        return res.status(200).json({
          token: token,
          expires_in: jwtExpirySeconds,
          user: user,
        });
      }
      else {
        return res.status(404).send('User not found.')
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

};