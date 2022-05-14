const dotenv=require('dotenv')
dotenv.config();
let {APP_PORT,DEBUG_MODE,DB_URL,JWT_SECRET,REFRESH_SECRET,APP_URL}=process.env;
module.exports={
    APP_PORT,DEBUG_MODE,DB_URL,JWT_SECRET,REFRESH_SECRET,APP_URL
} 