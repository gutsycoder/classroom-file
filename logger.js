const {format,createLogger,transports}= require('winston');
const {timestamp,combine,printf}=format;
const util = require('util');
const logFormat = printf(({level,message,timestamp,stack})=>{
    if (stack){
        message+='\n' + stack;
    }
    return `${timestamp} ${level}: ${util.inspect(message)}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        format.errors({stack:true}),
        logFormat),
        transports:[new transports.Console(),
        new transports.File({filename:'storage/logs/app.log'})]
});

module.exports =logger;