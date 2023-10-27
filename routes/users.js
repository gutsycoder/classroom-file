const express = require('express');
const router = express.Router();
router.post('/signup',(req,res)=>{
    return res.status(200).json({message:"Signing up the user",data:[]});
})
module.exports=router;