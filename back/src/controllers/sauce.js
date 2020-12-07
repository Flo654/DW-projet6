import Sauce from '../models/sauce';
import fsExtra from'fs-extra';
import resizeImages from "../utils/resizeImages";

//////////////////////////////////////
///////////// create sauce  //////////
//////////////////////////////////////
export const createSauce = async (req,res,next)=>{   
    try { 
        const sauceObjet = JSON.parse(req.body.sauce);
        const sauce = new Sauce({
            ...sauceObjet,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
         });
        //resize picture
        const imageToResize = `${req.file.path}`
        resizeImages(imageToResize);

        await sauce.save();       
        res.status(201).json({ message: 'Nouvelle sauce créé !' });        
    } catch (error) {
        res.status(400).json({ error });
    };
};

//////////////////////////////////////
/////////// get all sauces  //////////
//////////////////////////////////////
export const readAllSauces = async (req,res,next)=>{   
    try { 
        const result = await Sauce.find();
        res.status(201).json(result);        
    } catch (error) {
        res.status(400).json({ error });
    };
};

//////////////////////////////////////
////////// get one sauce  ////////////
//////////////////////////////////////
export const readOneSauce = async (req,res,next)=>{   
    try { 
        const id = req.params.id;
        const result = await Sauce.findById(id);
        res.status(201).json(result);        
    } catch (error) {
        res.status(400).json({ error })
    };
};

//////////////////////////////////////
/////////// modify sauce  ////////////
//////////////////////////////////////
export const updateSauce = async(req, res, next) => {      
    try {
      const id = req.params.id;      
      const sauceObjet = req.file ?
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body};
      //delete old image if changing image
      if(req.file !== undefined){
        const sauceData =  await Sauce.findById(id);
        const imageToRemove = sauceData.imageUrl;
        const filename = imageToRemove.split('/images/')[1];
        fsExtra.remove(`images/${filename}`); 
        //resize picture
        const imageToResize = `${req.file.path}`
        resizeImages(imageToResize);
      };
      
      await Sauce.findByIdAndUpdate(id, {...sauceObjet});
      res.status(200).json({ message: 'Objet modifié !'});
    } catch (error) {
      res.status(404).json({ error });
    } ;
};

//////////////////////////////////////
////////// delete sauce  /////////////
//////////////////////////////////////
export const deleteSauce = async (req,res,next)=>{   
   try { 
        const id = req.params.id;
        const essai =  await Sauce.findById(id);          
        const filename = essai.imageUrl.split('/images/')[1];
        fsExtra.remove(`images/${filename}`);        
        await Sauce.findByIdAndDelete(id);
        res.status(200).json({ message: 'Sauce supprimée'});        
    } catch (error) {
        res.status(400).json({ error })
    }
}

//////////////////////////////////////
//////// like ou dislike sauce  //////
//////////////////////////////////////

export const likeOrDislikeSauce = async(req, res, next)=>{
  try {
    const userId = req.body.userId;
    const likes = req.body.like;
    const id = req.params.id;
    const sauce = await Sauce.findById(id);
    
    switch (likes) {
      case 1: // case if like=1
        try {
          if (!sauce.usersLiked.includes(userId)) {//check if user is already in usersLiked array
            await Sauce.findByIdAndUpdate(id, { $inc: {likes: 1}, $push: {usersLiked: userId}}) // incremente like and push user in  []usersLiked
            res.status(201).json({ message: 'vous avez aimé cette sauce !'})    
        }}catch (error) {
          res.status(400).json({ error })
        }      
        break;

      case 0: // case if like =0
        try {
          if (sauce.usersLiked.includes(userId)){ // if user is already in userLiked , decremente like and pull user from array
            await Sauce.findByIdAndUpdate(id, { $inc: {likes: -1}, $pull: {usersLiked: userId}})
            res.status(201).json({ message: 'Like retiré !'})
            break;
          } else if (sauce.usersDisliked.includes(userId)){  //  if user is already in userDisliked , decremente dislike and pull user from array
        
            await Sauce.findByIdAndUpdate(id, { $inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
            res.status(201).json({ message: 'Dislike retiré !'})
          }
          
        } catch (error) {
          res.status(400).json({ error })
        }
        
        break;

      case -1: //case if like =-1
        try {
          if (!sauce.usersDisliked.includes(userId)){ // check if user is already in []usersDisliked
            Sauce.findByIdAndUpdate(id, { $inc: {dislikes: 1}, $push: {usersDisliked: userId}}) //incremente dislike and push user in []usersDisliked
            res.status(201).json({ message: "Vous n'avez pas aimé cette sauce !"})
          
          }
          
        } catch (error) {
          res.status(400).json({ error })          
        }       
        break;

      default: break;
    }
  
  
  } catch (error) {
    res.status(400).json({ error });    
  };
};