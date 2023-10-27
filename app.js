const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const classroom = require('./routes/classrooms');
require('dotenv/config');
const dbConnection = require('./dbConnection');

app.use(bodyParser.json());

app.get('/',(req,res)=>{
    return res.status(200).json({message:"Server Is Running",data:[]});
});
app.use('/users',users);
app.use('/classroom',classroom);
async function initializeDB() {
    try {
      await dbConnection.connectDB();   //Implementing the singleton pattern for the db Connection
    } catch (error) {
      console.log(error);
    }
  }
  
initializeDB();
app.listen(process.env.PORT||3000);

