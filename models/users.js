const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    user_id:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type :String,
        enum: ['tutor','student'],
        default:'student',
        lowercase: true
    },
    role_id:{
        type: Number,
        enum:[1,2],
        default: 2
    },
    class_ids:{
        type:[String]
    }
},{timestamps:true});

module.exports = mongoose.model('users',userSchema);


