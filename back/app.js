// importation des  modules NPM
import  express  from "express";
import bodyParser from "body-parser";
import path from 'path';
import cors from 'cors';
//import 'dotenv/config'
import dbConnection  from "../back/src/utils/dbConnect";


//importation des routes 
import userRoutes from "../back/src/routes/user";
import sauceRoutes from "../back/src/routes/sauce";

//connection a la base de donnée
dbConnection()

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

export default app
