const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
router.post('/signup',(req,res)=>{
    usersController.createUser(req,res);
});
router.post('/login',(req,res)=>{
    usersController.loginUser(req,res);
})
   
module.exports=router;