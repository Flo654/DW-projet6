/////////////////////////////////////////
////// import dependancies modules///////
////////////////////////////////////////
import express  from "express";
import bodyParser from "body-parser";
import path from 'path';

////////////////////////////////////////
////// import security modules /////////
////////////////////////////////////////
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


////////////////////////////////////////
//////// utils & routes import /////////
////////////////////////////////////////
import userRoutes from "../back/src/routes/user";
import sauceRoutes from "../back/src/routes/sauce";
import dbConnection  from "../back/src/utils/dbConnect";

const app = express();

// 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: "Too many requests, please try again after 15 minutes"
});
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

//dataBase connection
dbConnection()

//entries points
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

export default app;
