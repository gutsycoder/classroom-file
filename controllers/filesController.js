const logger = require('../logger');
const Users = require('../models/users');
const classRoom = require('../models/classrooms');
const Files = require('../models/files');

class filesController{

    async uploadFile(req,res){
        try{
            const {file_name,classroom_id,file_type,description,file}=req.body;
            const user_id=req.userData.user_id;
            const role_id=req.userData.role_id;
            const user_name = req.userData.user_name;
            if(role_id!=1){
                return res.status(403).json({message:"Not Authorized To Add File",data:[]});
            }
            if(!file_name){
                return res.status(400).json({message:"File Name Is Required",data:[]});
            }
            if(!req.file && !file){
                return res.status(400).json({message:"File Is Required",data:[]});
            }
            if(!file_type){
                return res.status(400).json({message:"File Type Is Required",data:[]});
            }
            if(!classroom_id){
                return res.status(400).json({message:"ClassRoom Id is Requried",data:[]});
            }
            const supportedFileTypes =['AUDIO','VIDEO','IMAGE','URL'];
            if(!supportedFileTypes.includes(file_type.toUpperCase())){
                return res.status(400).json({message:`FILE TYPE NOT SUPPORTED`,data:`SUPPORTED FILE TYPES ARE ${supportedFileTypes}` });
            }
            const file_path = req.uploadedFilePath||file;
            console.log(file_path);
            const newFile = new Files({
                file_name,
                classroom_id,
                description,
                file_type,
                file_path,
                uploaded_by:{
                    tutor:user_name,
                    user_id:user_id
                }
            });
            await newFile.save();
            return res.status(200).json({message:"File Successfully Uploaded",data:newFile});
        }catch(error){
            logger.error(error);
            return res.status(500).json({message:"Something Went Wrong",data:[]});
        }
    }

}

module.exports = new filesController();