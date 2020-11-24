import Sauce from '../models/sauce';
import fsExtra from'fs-extra';
import resizeImages from "../utils/resizeImages";

//creer une sauce
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

// Obtenir la liste de toutes les sauces
export const readAllSauces = async (req,res,next)=>{   
    try { 
        const result = await Sauce.find();
        res.status(201).json(result);        
    } catch (error) {
        res.status(400).json({ error });
    };
};

// Obtenir une sauce grâce a son Id
export const readOneSauce = async (req,res,next)=>{   
    try { 
        const id = req.params.id;
        const result = await Sauce.findById(id);
        res.status(201).json(result);        
    } catch (error) {
        res.status(400).json({ error })
    };
};

// Modifier une sauce
export const updateSauce = async(req, res, next) => {      
    try {
      const id = req.params.id;      
      const sauceObjet = req.file ?
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body};
      //suppression de l'ancienne image si changement d'image lors de la modification du produit
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

//supprimer une sauce
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


//like ou dislike d'une sauce
/*exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const likes = req.body.like;
  const id = req.params.id
  Sauce.findById(id)
  .then (sauce => {
    switch (likes) {
      case 1:
        if (!sauce.usersLiked.includes(userId)) // ont verifie si l'Id de l'utilisateur n'est pas encore dans le tableau usersLiked 
        { 
          console.log('user like')
          Sauce.findByIdAndUpdate(id, { $inc: {likes: 1}, $push: {usersLiked: userId}}) // on ajoute 1 pour les likes et ont ajoute l'id utilisateur au []usersLiked
          .then(() => res.status(201).json({ message: 'Avis pris en compte !'}))
          .catch(error => res.status(400).json({ error }));
        }
        break;

      case 0:
        if (sauce.usersLiked.includes(userId)) // si l'id utilisateur est deja présent dans le tableau usersLiked ont retire son vote et son id du []usersLiked
         {
          console.log('user like -1')
          Sauce.findByIdAndUpdate(id, { $inc: {likes: -1}, $pull: {usersLiked: userId}})
          .then(() => res.status(201).json({ message: 'Avis retiré !'}))
          .catch(error => res.status(400).json({ error }));
        break;
        } else if (sauce.usersDisliked.includes(userId))  // si l'id utilisateur est deja présent dans le tableau usersDisliked ont retire son vote et son id du []usersDisliked
         {
          console.log('user dislike -1')
          Sauce.findByIdAndUpdate(id, { $inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
          .then(() => res.status(201).json({ message: 'Avis retiré !'}))
          .catch(error => res.status(400).json({ error }));
        }
        break;

      case -1:
        if (!sauce.usersDisliked.includes(userId)) // ont verifie si l'Id de l'utilisateur n'est pas encore dans le []usersDisliked
         {
          console.log('user dislike')
          Sauce.findByIdAndUpdate(id, { $inc: {dislikes: 1}, $push: {usersDisliked: userId}}) // on ajoute 1 pour les likes et ont ajoute l'id utilisateur au []usersLiked
          .then(() => res.status(201).json({ message: 'Avis pris en compte !'}))
          .catch(error => res.status(400).json({ error }));
        }
        break;

      default: break;
    }
  })
  .catch(error => res.status(400).json({ error}));
}
*/
export const likeOrDislikeSauce = async(req, res, next)=>{
  try {
    const userId = req.body.userId;
    const likes = req.body.like;
    const id = req.params.id;
    const sauce = await Sauce.findById(id);
    
    switch (likes) {
      case 1:
        try {
          if (!sauce.usersLiked.includes(userId)) {// ont verifie si l'Id de l'utilisateur n'est pas encore dans le tableau usersLiked 
            await Sauce.findByIdAndUpdate(id, { $inc: {likes: 1}, $push: {usersLiked: userId}}) // on ajoute 1 pour les likes et ont ajoute l'id utilisateur au []usersLiked
            res.status(201).json({ message: 'vous avez aimé cette sauce !'})    
        }}catch (error) {
          res.status(400).json({ error })
        }      
        break;

      case 0:
        if (sauce.usersLiked.includes(userId)) // si l'id utilisateur est deja présent dans le tableau usersLiked ont retire son vote et son id du []usersLiked
        {
          Sauce.findByIdAndUpdate(id, { $inc: {likes: -1}, $pull: {usersLiked: userId}})
          .then(() => res.status(201).json({ message: 'Like retiré !'}))
          .catch(error => res.status(400).json({ error }));
        break;
        } else if (sauce.usersDisliked.includes(userId))  // si l'id utilisateur est deja présent dans le tableau usersDisliked ont retire son vote et son id du []usersDisliked
        {
          Sauce.findByIdAndUpdate(id, { $inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
          .then(() => res.status(201).json({ message: 'Dislike retiré !'}))
          .catch(error => res.status(400).json({ error }));
        }
        break;

      case -1:
        if (!sauce.usersDisliked.includes(userId)) // ont verifie si l'Id de l'utilisateur n'est pas encore dans le []usersDisliked
        {
          Sauce.findByIdAndUpdate(id, { $inc: {dislikes: 1}, $push: {usersDisliked: userId}}) // on ajoute 1 pour les likes et ont ajoute l'id utilisateur au []usersLiked
          .then(() => res.status(201).json({ message: "Vous n'avez pas aimé cette sauce !"}))
          .catch(error => res.status(400).json({ error }));
        }
        break;

      default: break;
    }
  
  
  } catch (error) {
    res.status(400).json({ error });    
  };
};