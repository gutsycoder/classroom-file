module.exports = (req,res,next)=>{
    try{
        const role_id =  req.userData.role_id;
        if(role_id!=1){
            return res.status(403).json({message:"Unauthorized To Do The Given Operation",data:[]});
        }
        next();
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Something Went Wrong",data:[]});
    }
}