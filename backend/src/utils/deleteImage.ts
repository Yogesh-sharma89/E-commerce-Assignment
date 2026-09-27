import imageKit from "../config/imagekit.js"

const DeleteImage = async (fileId: string) => {
    try {

        await imageKit.files.delete(fileId);

    } catch (err) {
        console.log("Error in delete image :", err);
        throw err;
    }
}

export default DeleteImage;