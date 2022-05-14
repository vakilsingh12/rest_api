const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const  {APP_PORT,DB_URL}= require('./config');
const errorHandler = require('./middlewares/errorHandler');
const app = express()
const routes=require('./routes')
global.appRoot=path.resolve(__dirname)
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/api',routes);
app.use('/uploads',express.static('uploads'))
mongoose.connect(DB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
const db=mongoose.connection
db.on('error',console.error.bind(console,'Connection error'))
db.once('open',()=>{
    console.log('DB connected...')
})

app.use(errorHandler)
app.listen(APP_PORT, () => console.log(`Example app listening on port ${APP_PORT}!`))