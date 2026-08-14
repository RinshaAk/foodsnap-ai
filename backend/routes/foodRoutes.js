import express from 'express';
import multer from 'multer';
import path from 'path';

import {scanFood} from '../controllers/foodController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits:{
        fileSize:  5 * 1024 * 1024, // 5MB limit
    },

    fileFilter:(req,file,cb)=>{
        const allowedTypes =  /jpeg|jpg|png|webp/;

        const extention = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        const mimeType = allowedTypes.test(file.mimetype);

        if(extention && mimeType){
            cb(null,true);
        }else{
            cb(new Error('Only images are allowed'));
        }
    }
})


router.post('/analyze', upload.single("image"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({
            success:false,
            message:"please upload a food image",

        })
    }

    res.status(200).json({
        success:true,
        message:"Food image uploaded successfully",
        image:req.file.filename,
    });
});



export default router;
