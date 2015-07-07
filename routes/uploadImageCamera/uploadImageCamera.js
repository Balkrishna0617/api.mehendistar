module.exports = function(app){

  var express = require('express');
  var router = express.Router();
  var mongodb = require('mongodb'); 
  var bodyParser = require('body-parser');
  var fs = require('fs');
  var db = require('../../db_conn');              // Database Connection

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({
      extended: true
  }));

  var done=false;
  var postId;
  var file_dir = app.get('file_serving_dir');
  var server_add = app.get('server_addr');  
  router.post('/photoCamera',function(req,res){
    
    var uID = req.body.userID;
    var desc = req.body.desc;
    var tags = req.body.tagName;
    var data = req.body.imageData;

  // file upload code via 'fs' module.
    var base64Data,
    binaryData;

    base64Data  =   data.replace(/^data:image\/jpeg;base64,/, "");
    base64Data  +=  base64Data.replace('+', ' ');
    binaryData  =   new Buffer(base64Data, 'base64').toString('binary');
    var filename = "camera" + Date.now() + ".jpg";
    var fileURL = file_dir+"/uploads/" + filename;
    fs.writeFile(fileURL, binaryData, "binary", function (err) {
        if (err) {
          console.log(err); // writes out file without error, but it's not a valid image  
        }else{
          console.log("outside query");
          db.collection('Posts').insert({ "uid" : mongodb.ObjectId(uID), "description" : desc, "caption" : filename, "imagePath" : server_add+"/uploads/"+filename, "tags" : tags, "cntLikes" : 0, "cntShares" : 0, "cntComments" : 0, "uploadDate" : new Date() }, function (err, docs){
              tags = ""; 
              if(err){
                console.log(err);
              }
              console.log("inside query");   
          });
          res.send("File uploaded.");
          console.log("File uploaded."); 
        }      
    });
  });

  return router;
};