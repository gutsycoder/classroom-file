const logger = require('../logger');
const Users = require('../models/users');
const classRoom = require('../models/classrooms');
const Files = require('../models/files');
const fs=require('fs');
class filesController{

    async uploadFile(req,res){
        try{
            const {file_name,classroom_id,file_type,description,file}=req.body;
            const user_id=req.userData.user_id;
            const user_name = req.userData.user_name;
            const uploadedFile = req.file;
            if(!file_name){
                if(uploadedFile){
                    console.log(uploadedFile.path);
                    fs.unlinkSync(uploadedFile.path);
                }
                return res.status(400).json({message:"File Name Is Required",data:[]});
            }
            if(!req.file && !file){
                return res.status(400).json({message:"File Is Required",data:[]});
            }
            if(!file_type){
                if(uploadedFile){
                    console.log(uploadedFile.path);
                    fs.unlinkSync(uploadedFile.path);
                }
                return res.status(400).json({message:"File Type Is Required",data:[]});
            }
            if(!classroom_id){
                if(uploadedFile){
                    console.log(uploadedFile.path);
                    fs.unlinkSync(uploadedFile.path);
                }
                return res.status(400).json({message:"ClassRoom Id is Requried",data:[]});
            }
            const supportedFileTypes =['AUDIO','VIDEO','IMAGE','URL'];
            if(!supportedFileTypes.includes(file_type.toUpperCase())){
                if(uploadedFile){
                    console.log(uploadedFile.path);
                    fs.unlinkSync(uploadedFile.path);
                }
                return res.status(400).json({message:`FILE TYPE NOT SUPPORTED`,data:`SUPPORTED FILE TYPES ARE ${supportedFileTypes}` });
            }
            const file_path = req.uploadedFilePath||file;
            console.log(file_path);
            const validTutor = await classRoom.findOne({_id:classroom_id,"created_by.user_id":user_id});
            console.log(validTutor);
            if(!validTutor){
                if(uploadedFile){
                    console.log(uploadedFile.path);
                    fs.unlinkSync(uploadedFile.path);
                }
                return res.status(400).json({message:"You can upload file to your own class",data:[]});
            }
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

    async updateFile(req,res){
        try{
            const {description,file_name,file_type,file_id}=req.body;
            const user_id=req.userData.user_id;
            const uploadedFile =req.file;
            if(!file_id){
                return res.status(400).json({message:"File ID Is Requried",data:[]});
            }
            const updatedData={};
            if(description){
                updatedData.description=description;
            }
            if(file_name){
                updatedData.file_name=file_name;
            }
            if(file_type){
                const allowedFileTypes =['IMAGE','VIDEO','AUDIO','URL'];
                if(!allowedFileTypes.includes(file_type.toUpperCase())){
                    return res.status(400).json({message:"Unsupported File Type",data:`Supported file types are ${allowedFileTypes}`});
                }
                updatedData.file_type=file_type;
            }
            const updatedFile = await Files.findOneAndUpdate({_id:file_id,"uploaded_by.user_id":user_id},{$set:updatedData},{new:true});
            if(!updatedFile){
                return res.status(400).json({message:"File Doesnt Exists or File Not Created By You",data:[]});
            }
            return res.status(200).json({message:"File Updated Successfully",data:updatedFile});
        }catch(error){
            logger.error(error);
            return res.status(500).json({message:"Something Went Wrong",data:[]});
        }
    }

    async deleteFile(req,res){
        try{
            const {file_id}=req.body;
            if(!file_id){
                return res.status(400).json({message:"File ID Is Required",data:[]});
            }
            const user_id=req.userData.user_id;
            const deletedFile = await Files.findOneAndDelete({_id:file_id,"uploaded_by.user_id":user_id});
            if(!deletedFile){
                return res.status(400).json({message:"This File Doesnot Exists or Not Created By You",data:[]});
            }
            return res.status(200).json({message:"File Deleted Successfully",data:[]});

        }catch(error){
            logger.error(error);
            return res.status(500).json({message:"Something Went Wrong",data:[]});
        }
    }

    async getFiles(req,res){
        try{
            const user_id= req.userData.user_id;
            const role_id = req.userData.role_id;
            const {fileType,fileName}=req.query;
            var filter={}
            if(fileType){
                filter.file_type=fileType;
            }
            if(fileName){
                filter.file_name=fileName;
            }
            if(role_id==1){
                console.log('Getting the files for the tutor');
                var files = await this.getFilesForTutor(user_id,filter);
            }else{
                console.log("Getting files for the student");
                var files = await this.getFilesForStudent(user_id,filter);
            }
            
            return res.status(200).json({message:"Success",data:files});

        }catch(error){
            logger.error(error);
            return res.status(500).json({message:"Something Went Wrong",data:[]});
        }
    }


    async getFilesForTutor(user_id,filter){
        try{
            const files = await Files.find({"uploaded_by.user_id":user_id,...filter});
            return files;
        }catch(error){
            logger.error(error);
            throw {status:500,message:error.message||"Something Went Wrong"};
        }
    }

    async getFilesForStudent(user_id,filter){
        try{
            const classrooms= await classRoom.find({"students.student_user_id":user_id});
            console.log(classrooms);
            const classroom_ids = classrooms.map(classroom => classroom._id.toString());
            console.log(classroom_ids);
            const files = await Files.find({classroom_id:{$in:classroom_ids},...filter});
            console.log(files);
            return files;
        }catch(error){
            logger.error(error);
            throw {status:500,message:error.message||"Something Went Wrong"};
        }

    }

}

module.exports = new filesController();