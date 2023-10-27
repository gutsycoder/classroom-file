const mongoose = require('mongoose');
require('dotenv/config');
const uri = process.env.DB_CONNECTION;

class DBConnection{
    constructor(){
        console.log("Initializing the db connection instance for the first time");
        this.isConnected=false;
    }
    static getInstance(){
        if(!DBConnection.instance){
            DBConnection.instance= new DBConnection();
        }
        return DBConnection.instance;
    }


    async connectDB(){
        try{
            if(!this.isConnected){
                console.log("Connecting DB for the first time");
                await mongoose.connect(uri);
                console.log(`Connected to the Toddle-Classroom Database ${uri}`);
                this.isConnected=true;
            }
        }catch(error){
            console.log(error);
        }
    }
}

module.exports = DBConnection.getInstance();