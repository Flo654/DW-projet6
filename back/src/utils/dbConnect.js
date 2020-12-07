import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config() //loading environment variables and verify their presence

//////////////////////////////////////////////
////////////connection to Db function/////////
/////////////////////////////////////////////

const dbConnection = async()=>{
    try {
        mongoose.connect(process.env.DB_URL,{
            dbName: process.env.DB_NAME,
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('connected to Db!')
    } catch (error) {
        console.log('no connection with Db !');
        
    }
}


export default dbConnection