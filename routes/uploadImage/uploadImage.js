module.exports = function(app){

    var express = require('express');
    var router = express.Router();
    var mongodb = require('mongodb'); 
    var bodyParser = require('body-parser');
    var multer  = require('multer');                // Module for file upload.
//    var fs = require('fs');
    var db = require('../../db_conn');              // Database Connection
    //router.use(bodyParser.json());
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
//	router.use(bodyParser.urlencoded({
  //      	extended: true
//	}));

    var done=false;
    var postId;
    var imgName;
    var file_dir = app.get('file_serving_dir');
    var server_add = app.get('server_addr');
    router.use(multer({ dest: file_dir+'/uploads/',
//       	limits: {
//             fields: 10, // max 10 non-multipart fields
//             parts: 10, // max 10 multipart fields
//             fileSize: 8 * 1000 * 1000 // files can be at most 8MB each
//           },
        rename: function (fieldname, filename, file) {
//        // console.log("file : ", file);
//        console.log("renaming file.... filename ", filename);
//        console.log("renaming file.... fieldname ", fieldname);
//        // var ext = '.' + filename.split('.').slice(-1)[0];
//        // console.log("ext ", ext);
          if (filename.indexOf('%')>0) {
            imgName = "gallery"+Date.now()+".jpg";   
            return imgName;
          }else{
            imgName = "gallery"+Date.now();   
            return imgName;
          }              
      },
    onFileUploadStart: function (file) {
//      console.log('file.size', file.size);
      // if(!file.extension){
      //     file.name = file.name + ".jpg";
      //     file.path = file.path + ".jpg";
      // }

      // console.log(file.fieldname + ' uploaded to  ' + file.path)
      // console.log("extension of file : ", file.extension);
      // done=true;
    },  
    onFileUploadComplete: function (file) {
      console.log(file.fieldname + ' uploaded to  ' + file.path)
      console.log("extension of file : ", file.extension);
      done=true;
    }
    }));


    router.post('/photo',function(req,res){      
      var uID = req.body.userID;
      var desc = req.body.desc;
      var tagstr = req.body.tagName;
     	console.log(tagstr);
     var tags = tagstr.split(",");
//      var tags = ["Indian","Common"];
//      //console.log("file from client : ", req.files.userPhoto);
      if(done==true){
        if(!req.files.userPhoto.extension){
            // imgName = imgName + ".jpg";
        }else{
          imgName = imgName+"."+req.files.userPhoto.extension;
        }
        db.collection('Posts').insert({ "uid" : mongodb.ObjectId(uID), "description" : desc, "caption" : req.files.userPhoto.name, "imagePath" : server_add+"/uploads/"+imgName, "tags" : tags, "cntLikes" : 0, "cntShares" : 0, "cntComments" : 0, "uploadDate" : new Date() }, function(err, docs){
             tags = "";    
        });
        res.send("File uploaded.");
      }
    });

  return router;
}