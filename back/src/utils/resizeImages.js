import resizeOptimizeImages from "resize-optimize-images";

///////////////////////////////////////////////////
//////////// resizing image function //////////////
///////////////////////////////////////////////////
const resizeImages = async (url)=>{
    
    const options = {
        images: [ url ],
        width: 300,
        height: 300,
        quality: 90
    };
 
    await resizeOptimizeImages(options);
}

export default resizeImages
