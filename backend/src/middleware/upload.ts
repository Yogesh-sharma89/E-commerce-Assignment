import multer, { type FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import type { Request } from "express";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const UPLOAD_DIR = path.join(_dirname, "../../uploads");



const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];


if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({

    destination(_req, _file, callback) {
        callback(null, UPLOAD_DIR)
    },

    filename(_req, file, callback) {

        const uniqueSuffix = crypto.randomUUID();

        const extension = path.extname(file.originalname).toLowerCase();

        const filename = `${uniqueSuffix}${extension}`;

        callback(null, filename)
    },
})


const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
 
    const extension = path.extname(file.originalname).toLowerCase();

    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);

    const isValidExtension = allowedExtensions.includes(extension);
    
    if(isValidExtension && isValidMimeType){
        cb(null,true);
    }else{
        cb(new Error("Only image files are allowed"))
    }

}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5
    }
})

export default upload;
