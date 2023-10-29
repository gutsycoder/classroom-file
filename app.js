const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const classroom = require('./routes/classrooms');
const files = require('./routes/files');
require('dotenv/config');
const dbConnection = require('./dbConnection');
global.__basedir = __dirname;

app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'));
app.get('/',(req,res)=>{
    return res.status(200).json({message:"Server Is Running",data:[]});
});
app.use('/users',users);
app.use('/classroom',classroom);
app.use('/files',files);
async function initializeDB() {
    try {
      await dbConnection.connectDB();   //Implementing the singleton pattern for the db Connection
    } catch (error) {
      console.log(error);
    }
  }
  
initializeDB();
app.listen(process.env.PORT||3000);

