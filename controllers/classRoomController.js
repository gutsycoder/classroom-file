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
}

module.exports = new classRoomController();