const logger = require('../logger');
const classRoom = require('../models/classrooms');
const Users = require('../models/users');
class classRoomController{
    async createClass(req,res){
        try{
            const {classroom,description,subject}=req.body;
            const user_id=req.userData.user_id;
            if(!classroom){
                return res.status(400).json({message:"ClassRoom Name Is Required",data:[]});
            }
            if(!subject){
                return res.status(400).json({message:"Subject Name Is Compulsory",data:[]});
            }
            const user =await Users.findOne({user_id});
            const role_id=user.role_id;
            if(role_id!=1){
                return res.status(400).json({message:"Not Authorized To Create The ClassRoom",data:[]});
            }
            const created_by= {tutor:user.name,user_id:user_id};

            const newClass = new classRoom({
                description,
                classroom,
                subject,
                created_by:created_by
            });
            await newClass.save();
            return res.status(200).json({message:"ClassRoom Created Successfully",data:newClass});

        }catch(error){
            logger.error(error);
            return res.status(500).json({message:"Something Went Wrong",data:[]});
        }
    }
    async editClass(req,res){
        try{
            const {classroom,description,subject,classroom_id}= req.body;
            const user_id=req.userData.user_id;
            const role_id= req.userData.role_id;
            if(role_id!=1){
                return res.status(400).json({message:"Not Authorized To Edit The ClassRoom",data:[]});
            }
            const updatedData={};
            if(classroom){
                updatedData.classroom= classroom;
            }
            if(description){
                updatedData.description=description;
            }
            if(subject){
                updatedData.subject=subject;
            }
            const updatedClass = await classRoom.findOneAndUpdate({_id:classroom_id,"created_by.user_id":user_id},{$set:updatedData},{new:true});
            if(!updatedClass){
                return res.status(404).json({message:`This Class Is Not Created By ${user_id} or the class does not exists` ,data:[]});
            }
            return res.status(200).json({message:"ClassRoom Details Updated Successfully",data:updatedClass});
        }catch(error){
            logger.error(error);
            return res.status(500).json({message:"Something Went Wrong",data:[]});
        }
    }

    async deleteClass(req,res){
        try{
            const {classroom_id}=req.body;
            const role_id = req.userData.role_id;
            const user_id=req.userData.user_id;
            if(!classroom_id){
                return res.status(400).json({message:"ClassRoom ID is Necessary",data:[]});
            }
            if(role_id!==1){
                return res.status(403).json({message:"Not Authorized To Delete Class",data:[]});
            }
            const deletedClass=await classRoom.findOneAndDelete({_id:classroom_id,"created_by.user_id":user_id});
            if(!deletedClass){
                return res.status(404).json({message:`This Class Is Not Created By ${user_id} or the class does not exists`,data:[]});
            }
            return res.status(200).json({message:"Class Deleted Successfully",data:[]});
        }catch(error){
            logger.error(error);
            return res.status(500).json({message:"Something Went Wrong",data:[]});
        }
    }
    async addStudent(req,res){
        try{
            const {student_user_id,classroom_id}=req.body;
            const user_id= req.userData.user_id;
            if(!student_user_id){
                return res.status(400).json({message:"Student USERID Is Required",data:[]});
            }
            if(!classroom_id){
                return res.status(400).json({message:"Class ID Is Required",data:[]});
            }
            const role_id = req.userData.role_id;
            if(role_id!==1){
                return res.status(403).json({message:"Not Authorized To Add Student",data:[]});
            }
            const classroom = await classRoom.findOne({_id:classroom_id,"created_by.user_id":user_id});
            if(!classroom){
                return res.status(404).json({message:"Classroom Not Found Or This Classroom not created by the tutor",data:[]});
            }
            const studentUser = await Users.findOne({user_id:student_user_id});
            if(!studentUser){
                return res.status(404).json({message:"Student Does not Exists",data:[]});
            }
            classroom.students.push({student_user_id});
            const updatedClassRoom = await classroom.save();
            return res.status(200).json({message:"Student Successfully Added to the Classroom",data:updatedClassRoom});
        }catch(error){
            logger.error(error);
            return res.status(500).json({message:"Something Went Wrong",data:[]});
        }
    }
}

module.exports = new classRoomController();