// module.exports = function(app){

//   var express = require('express');
//   var router = express.Router();
//   var mongodb = require('mongodb'); 
//   var bodyParser = require('body-parser');
//   var multer  = require('multer');
//   var fs = require('fs');
//   var db = require('../../db_conn');              // Database Connection

//   router.use(bodyParser.json());
//   router.use(bodyParser.urlencoded({
//       extended: true
//   }));

//   var done=false;
//   var imgName;
//   var file_dir = app.get('file_serving_dir');
//   var server_add = app.get('server_addr');
//   router.use(multer({ dest: file_dir+'/profile/',
//   	rename: function (fieldname, filename) {
//   	    if (filename.indexOf('%')>0) {
//           imgName = "galleryPP"+Date.now()+".jpg";   
//           return imgName;
//         }else{
//           imgName = "galleryPP" + Date.now();
//           return imgName;
//         }
//   	},
//   	onFileUploadStart: function (file) {
//   	  // console.log(file.originalname + ' is starting ...');
//   	},
//   	onFileUploadComplete: function (file) {
//   	  // console.log(file.fieldname + ' uploaded to  ' + file.path);
//   	  done=true;
//   	}
//   }));

//   router.post('/update',function (req,res){
//   	var uID = req.body.userID;  
//     if(done==true){
//       db.collection('Users').findOne({ "_id" : mongodb.ObjectId(uID)},{ DPPath : 1}, function (err, user){
//         var dpString = user.DPPath;
//         var dpName = dpString.substring(dpString.lastIndexOf('/'));
//         // console.log("dpName : ", dpName);
        
//         if(dpName === '/Profile-Icon.png')
//         {
//             // console.log('Normal Execution');
//             // imgName = imgName+"."+req.files.userPhoto.extension;
//             if(!req.files.userPhoto.extension){
//                 // imgName = imgName + ".jpg";
//             }else{
//               imgName = imgName+"."+req.files.userPhoto.extension;
//             }
//             db.collection('Users').update({ _id : mongodb.ObjectId(uID)},{ $set : { DPPath : server_add+"/profile/"+imgName }},function (err, docs){
//               res.send("Profile pic updated.");
//             });
//         }else{
//           // console.log('Special Case Execution');
//           fs.unlink(file_dir+'/profile'+dpName, function (err){
//             if(!req.files.userPhoto.extension){
//                 // imgName = imgName + ".jpg";
//             }else{
//               imgName = imgName+"."+req.files.userPhoto.extension;
//             }
//             db.collection('Users').update({ _id : mongodb.ObjectId(uID)},{ $set : { DPPath : server_add+"/profile/"+imgName }},function (err, docs){
//               res.send("Profile pic updated.");
//             });              
//           }); 
//         }
//       });    
//     }
//   });
//   return router;
// }
module.exports = function(app){

var express = require('express');
var router = express.Router();
var mongodb = require('mongodb'); 
var bodyParser = require('body-parser');
var multer  = require('multer');                // Module for file upload.
var fs = require('fs');
var lwip = require('lwip');                     // module for file compression
var db = require('../../db_conn');              // Database Connection
var logs = require('../../logs/apiMehndiStar')();

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
var imgName;
var file_dir = app.get('file_serving_dir');
var server_add = app.get('server_addr');
router.use(multer({ dest: file_dir+'/profile/',
  rename: function (fieldname, filename) {
      if (filename.indexOf('%')>0) {
        imgName = "galleryPP"+Date.now()+".jpg";   
        return imgName;
      }else{
        imgName = "galleryPP" + Date.now();
        return imgName;
      }
  },
  onFileUploadStart: function (file) {
    // console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    lwip.open(file.path, function(err, image){
      var imgWidth = 720;
      var aspect = image.width() / imgWidth;    
      image.batch()
        .resize(image.width()/aspect,image.height()/aspect)
        .writeFile(file_dir+'/profile_low/' + file.name, function(err){                
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
  },
  onError: function(err, next) {
      if(err){
          logs.logErrorFileUpload(err);
      }
      done = false;
      next();
  }
}));

  router.post('/update',function (req,res){
    var uID = req.body.userID;  
    if(done==true){
      db.collection('Users').findOne({ "_id" : mongodb.ObjectId(uID)},{ DPPath : 1}, function (err, user){
        if(err){
            logs.logError(err, req, res);
        }
        if(user){
          var dpString = user.DPPath;
          var dpName = dpString.substring(dpString.lastIndexOf('/'));
          // console.log("dpName : ", dpName);
          
          if(dpName === '/Profile-Icon.png')
          {
              // console.log('Normal Execution');
              // imgName = imgName+"."+req.files.userPhoto.extension;
              if(!req.files.userPhoto.extension){
                  // imgName = imgName + ".jpg";
              }else{
                imgName = imgName+"."+req.files.userPhoto.extension;
              }
              db.collection('Users').update({ _id : mongodb.ObjectId(uID)},{ $set : { DPPath : server_add+"/profile/"+imgName, DPPathLow : server_add+"/profile_low/"+imgName, DPPathHigh : server_add+"/profile/"+imgName  }},function (err, docs){
                if(err){
                    logs.logError(err, req, res);
                }
                if(docs){
                  res.send("Profile pic updated.");  
                }                
              });
          }else{
            // console.log('Special Case Execution');
            fs.unlink(file_dir+'/profile'+dpName, function (err){
              if(err){
                  logs.logError(err, req, res);
              }              
              if(!req.files.userPhoto.extension){
                  // imgName = imgName + ".jpg";
              }else{
                imgName = imgName+"."+req.files.userPhoto.extension;
              }
              db.collection('Users').update({ _id : mongodb.ObjectId(uID)},{ $set : { DPPathHigh : server_add+"/profile/"+imgName, DPPathLow : server_add+"/profile_low/"+imgName, DPPath : server_add+"/profile/"+imgName }},function (err, docs){
                if(err){
                    logs.logError(err, req, res);
                }
                if(docs){
                  fs.unlink(file_dir+'/profile_low'+dpName, function (err){
                    db.collection('Users').update({ _id : mongodb.ObjectId(uID)},{ $set : { DPPathLow : server_add+"/profile_low/"+imgName }},function (err, docs){
                      if(err){
                          logs.logError(err, req, res);
                      }
                      if(docs){
                        res.send("Profile pic updated.");
                      }                      
                    });
                  })
                }
                
              });              
            }); 
          }
        }
          
      }); 
    }else{
    res.send('Something went wrong, Found Error in Profile Pic upload');
  }
  });
  return router;
}