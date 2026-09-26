import imageKit from "../config/imagekit.js"
import fs from "node:fs";


const UploadImage = async(file:Express.Multer.File)=>{

    try{

        const result = await imageKit.files.upload({
            file:fs.createReadStream(file.path),
            fileName:file.filename,
            folder:"/products"
        })

        await fs.promises.unlink(file.path)

        return {
            url:result.url,
            publicId:result.fileId,
            thumbnailUrl:result.thumbnailUrl,
            type:result.fileType
        }

    }catch(err){

        await fs.promises.unlink(file.path);
        console.log("Error in upload image", err);
        throw err;

    }
}

export default UploadImage;