const logger = require('../logger');
const Users = require('../models/users');
const bcryptjs = require('bcryptjs');
class usersService{
    async createUser(user_info){
        try{
            console.log('Creating a New User');
            const hash =   await  bcryptjs.hash(user_info.password,10);
            const newUser = new Users({
                name:user_info.name,
                user_id: user_info.user_id,
                password:hash,
                role: user_info.role,
                role_id: user_info.role.toLowerCase()=="tutor"?1:2,
            });
            const userRes= await newUser.save();
            return userRes;

        }catch(error){
            logger.error(error);
            console.error(error);
            throw {status:500,message:"Something Went Wrong"};
        }
    }
}

module.exports = new usersService();