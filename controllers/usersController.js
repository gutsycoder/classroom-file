const logger = require('../logger');
const Users = require('../models/users');
const usersService = require('../services/usersService');
const bcryptjs= require('bcryptjs');
const jwt = require('jsonwebtoken');
class UserController{
    async createUser(req,res){
        try{
            const {name,role,user_id,password}= req.body;
            if(!name){
                return res.status(400).json({message:"Name Is Required",data:[]});
            }
            if(!role){
                return res.status(400).json({message:"Role Is Required",data:[]});
            }
            if(!user_id){
                return res.status(400).json({message:"User_ID is Required",data:[]});
            }
            if(!password){
                return res.status(400).json({message:"Password is Required",data:[]});
            }
            const role_types=['tutor','student'];
            if(!role_types.includes(role.toLowerCase())){
                return res.status(400).json({message:"Roles can either be tutor or student",data:[]});
            }
            const user = await Users.findOne({user_id});
            if(user){
                return res.status(409).json({message:"User ID already Taken",data:[]});
            }
            const result = await usersService.createUser(req.body);

            return res.status(200).json({message:"User Created Successfully",data:result});

        }catch(error){
            logger.error(error);
            return res.status(500).json({message:"Something Went Wrong",data:[]});
        }
    }

    async loginUser(req,res){
        try{
            const {user_id,password}= req.body;
            const expires="30d";
            const user = await Users.findOne({user_id});
            if(!user){
                return res.status(400).json({message:"UserID is Not Registered"});
            }
            if(!password){
                return res.status(400).json({message:"Password Can't Be Empty",data:[]});
            }
            const isMatch = await bcryptjs.compare(password,user.password);
            if(!isMatch){
                return res.status(403).json({message:"Authentication Failed",data:[]});
            }
            const token = jwt.sign({
                user_id:user.user_id,
                name: user.name,
                role:user.role,
                role_id:user.role_id
            },process.env.JWT_KEY,{
                expiresIn: expires
            });
            return res.status(200).json({message:"Authentication Successfull",user:user,jwt_token:token});
        }catch(error){
            logger.error(error);
            return res.status(500).json({message:"Something Went Wrong",data:[]});
        }
    }
}

module.exports = new UserController();