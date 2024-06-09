import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from 'express';
import dotenv from 'dotenv';
import userRoutes from '../routes/usersRoutes';
import blogRoutes from '../routes/blogRoutes';
import mongoose, { mongo } from 'mongoose';
import cookieParser = require('cookie-parser');
import errorHandler from '../middlewares/errorHandler';

dotenv.config();

const app: Application = express();

mongoose.connect(process.env.MONGODB_URI!);
const port = process.env.PORT || 8000;

const db = mongoose.connection;
db.on('connected', () => console.log('Connected to DataBase successfully'));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

app.use(errorHandler);
