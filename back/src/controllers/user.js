// controllers user
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import 'dotenv/config';


 export const createUser = async(req, res, next) =>{
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User ({
            email: req.body.email,
            password: hashPassword
        });
        
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé !'});
    } catch (error) {
        res.status(500).json({ error });        
    };

};

// login user controller
export const readUser =async(req, res, next) =>{
    try {       
        const userExist = await User.findOne({ email: req.body.email})   
        
        if(!userExist){
            
            return res.status(401).json({ error: 'Utilisateur non trouvé ou password erroné!'})
        };  
        const passVerify = await bcrypt.compare(req.body.password, userExist.password);
        if(!passVerify){
            
            return res.status(402).json({ error: 'Utilisateur non trouvé ou password erroné!'})
        };  
        res.status(200).json({
            userId: userExist._id,
            // token d'authentification attribué par jwt
            token: jwt.sign(
                { userId: userExist._id },
                ( process.env.AUTH_TOKEN ),
                { expiresIn: '24h' }
            )
        });                   
    } catch (error) {
        res.status(500).json({ error })
    };
};
