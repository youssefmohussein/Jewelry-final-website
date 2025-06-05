const path = require('path');
const multer= require("multer");// for uploading images

// define storge for image 
const storage = multer.diskStorage({
  destination:function(req,file,callback){
    callback(null,"./public/images")
  },

  //add back to extension
  filename:function(req,file,callback){
  callback(null,Date.now() + file.originalname)
  
  },
});
// upload parameters for multer
const uploads =multer({
  storage:storage,
  limits:{
    fileSize:1024*1024*3,
  },
});
module.exports = uploads;