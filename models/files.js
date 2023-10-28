const mongoose = require('mongoose');
const filesSchema = new mongoose.Schema({
    file_name: {
        type: String,
        required: [true,'File Name Is Required']
    },
    file_path:{
        type: String,
        required: true
    },
    classroom_id:{
        type: String,
        required: [true,'Classroom Id Is Required']
    },
    file_type:{
        type: String,
        enum:['AUDIO','VIDEO','IMAGE','URL'],
        required:[true,'File Type Is Required']
    },
    description:{
        type: String,
        default:""
    },
    uploaded_at:{
        type:Date,
        default: Date.now
    },
    uploaded_by:{
        tutor:{
            type:String,
            required:true
        },
        user_id:{
            type:String,
            required:true
        }
    },
},{timestamps:true});


module.exports =  mongoose.model('files',filesSchema);