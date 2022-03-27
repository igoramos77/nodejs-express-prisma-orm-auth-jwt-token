import express, {Request, Response, NextFunction} from 'express';
import 'express-async-errors';
import { router } from './routes';
import { errors } from 'celebrate';
import AppError from './errors/AppError';


const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(router);

app.use(errors());
app.use((error: Error, req: Request, res: Response, _: NextFunction) => {

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'Error',
      error: error.message,
    });
  } 

  console.log(error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error."
  });
});

app.listen('3000', () => console.log('server is running! 🎉'));