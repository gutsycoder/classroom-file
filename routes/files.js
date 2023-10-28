const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const fs= require('fs');
//const fileController = require('../controllers/fileController');
const multer = require('multer');

const uploadDir = 'uploads';
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const multerStorage =  multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads');
    },
    filename: (req,file,cb)=>{
        const ext = file.mimetype.split('/')[1];
        cb(null,`${file.originalname}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req,file,cb)=>{
    const allowedExtensions = ['mp3', 'wav', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mkv'];
    const fileExtension = file.mimetype.split("/")[1];

    if(allowedExtensions.includes(fileExtension)){
        cb(null,true);
    }else{
        cb(new Error("Not A Supported File Type"),false);
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});



router.post('/upload',checkAuth,(req,res)=>{
    try{
        upload.single("file")(req,res,(err)=>{
            if(err){
                if(err instanceof multer.MulterError){
                    return res.status(400).json({message:"File Upload Error",data:err});
                }else{
                    return res.status(400).json({message:"Unsupported File Type",data:err});
                }
            }
            return res.status(200).json({message:"File Uploaded Successfully",data:[]});
        });
        
    }catch(error){
       return res.status(400).json({messsage:"File Type Not Supported",data:error});
    }

   
});



module.exports= router;