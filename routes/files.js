const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const fs= require('fs');
const filesController = require('../controllers/filesController');
const multer = require('multer');
const path = require('path');
const checkTutor = require('../middleware/checkTutor');
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
        const filename =`${file.originalname}-${Date.now()}.${ext}`;
        req.uploadedFilePath = path.join(uploadDir,filename);
        cb(null,filename);

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



router.post('/upload',checkAuth,checkTutor,(req,res)=>{
    try{
        upload.single("file")(req,res,(err)=>{
            if(err){
                if(err instanceof multer.MulterError){
                    return res.status(400).json({message:"File Upload Error",data:err});
                }else{
                    return res.status(400).json({message:"Unsupported File Type",data:err});
                }
            }
            filesController.uploadFile(req,res);
        });
        
    }catch(error){
       return res.status(500).json({messsage:"Something Went Wrong",data:[]});
    }

   
});

router.put('/update',checkAuth,checkTutor,(req,res)=>{
    filesController.updateFile(req,res);
})

router.delete('/delete',checkAuth,checkTutor,(req,res)=>{
    filesController.deleteFile(req,res);
});


router.get('/',checkAuth,(req,res)=>{
    filesController.getFiles(req,res);
});



module.exports= router;