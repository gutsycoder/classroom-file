const mongoose = require('mongoose');

const classRoomSchema = new mongoose.Schema({
    classroom:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    description:String,
    created_by:{
       tutor:{
        type: String,
        required:true
       },
       user_id:{
        type: String,
        required:true
       }
    },
    students:[{
        _id: false,
        student_id: String
    }],
    files:[{
        _id: false,
        file_id: String
    }],
},{timestamps:true});

module.exports = mongoose.model('classrooms',classRoomSchema);