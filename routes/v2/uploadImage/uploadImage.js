module.exports = function(app){

var express = require('express');
var router = express.Router();
var mongodb = require('mongodb'); 
var bodyParser = require('body-parser');
var multer  = require('multer');                // Module for file upload.
var Imagemin = require('imagemin');
var fs = require('fs');
var lwip = require('lwip');                     // module for file compression
var db = require('../../../db_conn');              // Database Connection

router.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
router.use(bodyParser.json({ 
    limit: '50mb'
}));
router.use(bodyParser.text({ 
    limit: '50mb'
}));
router.use(bodyParser.raw({ 
    limit: '50mb'
}));

var done=false;
var postId;
var imgName;
var file_dir = app.get('file_serving_dir');
var server_add = app.get('server_addr');
router.use(multer({ dest: file_dir+'/uploads/',
rename: function (fieldname, filename, file) {
  if (filename.indexOf('%')>0) {
    imgName = "gallery"+Date.now()+".jpg";   
    return imgName;
  }else{
    imgName = "gallery"+Date.now();   
    return imgName;
  }              
},
onFileUploadStart: function (file) {;
},  
onFileUploadComplete: function (file) {
  lwip.open(file.path, function(err, image){
    var imgWidth = 1240;
    var aspect = image.width() / imgWidth;    
    image.batch()
      .resize(image.width()/aspect,image.height()/aspect)
      .writeFile(file_dir+'/uploads_low/' + file.name, function(err){                
        console.log(err);                  
        if(err !== null){
          console.log("inside error");
          fs.unlink(file.path, function(err){
              if (err) {
                  return console.error(err);
              }
              done = false;         
          });  
        }        
      });
  });
  done=true;
}
}));


router.post('/photo',function(req,res){      
  var uID = req.body.userID;
  var desc = req.body.desc;
  var tagstr = req.body.tagName;
  var tags = tagstr.split(",");

  // var uID = "559cb36be7fbbd2320d676a6";
  // var desc = "Demov2";
  // var tags = ["Common"];
  if(done==true){
    if(!req.files.userPhoto.extension){
        // imgName = imgName + ".jpg";
    }else{
      imgName = imgName+"."+req.files.userPhoto.extension;
    }
    db.collection('Posts').insert({ "uid" : mongodb.ObjectId(uID), "description" : desc, "caption" : req.files.userPhoto.name, "imagePath" : server_add+"/uploads/"+imgName,"imagePathLow" : server_add+"/uploads_low/"+imgName, "imagePathHigh" : server_add+"/uploads/"+imgName, "tags" : tags, "cntLikes" : 0, "cntShares" : 0, "cntComments" : 0, "uploadDate" : new Date() }, function(err, docs){
         tags = "";    
    });
    res.send("File uploaded.");
  }
});

return router;
}