module.exports = function(app){

  var express = require('express');
  var router = express.Router();
  var mongodb = require('mongodb'); 
  var bodyParser = require('body-parser');
  var fs = require('fs');
  var lwip = require('lwip');                     // module for file compression
  var db = require('../../db_conn');              // Database Connection
  var logs = require('../../logs/apiMehndiStar')();
  // router.use(bodyParser.json());
  // router.use(bodyParser.urlencoded({
  //     extended: true
  // }));
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
  router.post('/updateCamera',function (req,res){
  	var uID = req.body.userID;  
    var data = req.body.imageData;

  // file upload code via 'fs' module.
    var base64Data,
    binaryData;

    base64Data  =   data.replace(/^data:image\/jpeg;base64,/, "");
    base64Data  +=  base64Data.replace('+', ' ');
    binaryData  =   new Buffer(base64Data, 'base64').toString('binary');
    var filename = "cameraPP" + Date.now() + ".jpg";
    var fileURL = file_dir + "/profile/" + filename;
    fs.writeFile(fileURL, binaryData, "binary", function (err) {
        if (err) {
          logs.logError(err, req, res); // writes out file without error, but it's not a valid image  
        }else{
          // console.log("outside query");
          
      db.collection('Users').findOne({ "_id" : mongodb.ObjectId(uID)},{ DPPath : 1}, function (err, user){
        if(err){
           logs.logError(err, req, res);
        }
        if(user){
          var dpString = user.DPPath;
          var dpName = dpString.substring(dpString.lastIndexOf('/'));
          // console.log("dpName : ", dpName);
          lwip.open(fileURL, function(err, image){
            if(err){
               logs.logError(err, req, res);
            }
            if(image){
              var imgWidth = 720;
              var aspect = image.width() / imgWidth;    
              image.batch()
                .resize(image.width()/aspect,image.height()/aspect)
                .writeFile(file_dir+'/profile_low/' + filename, function(err){                
                  console.log(err);                          
                });
            }            
          });
          if(dpName === '/Profile-Icon.png')
          {
              // console.log('Normal Execution');
              db.collection('Users').update({ _id : mongodb.ObjectId(uID)},{ $set : { DPPath : server_add+"/profile/"+filename, DPPathHigh : server_add+"/profile/"+filename, DPPathLow : server_add+"/profile_low/"+filename }},function (err, docs){
                if(err){
                   logs.logError(err, req, res);
                }
                if(docs){
                  res.send("Profile pic updated.");
                }                    
              });
          }else{
            // console.log('Special Case Execution');
            fs.unlink(file_dir+'/profile'+dpName, function(err){
                if (err) {
                  res.send("Something went wrong :(");
                }else{
                  db.collection('Users').update({ _id : mongodb.ObjectId(uID)},{ $set : { DPPathHigh : server_add+"/profile/"+filename, DPPath : server_add+"/profile/"+filename, DPPathLow : server_add+"/profile_low/"+filename }},function (err, docs){
                    if(err){
                       logs.logError(err, req, res);
                    }
                    if(docs){
                      fs.unlink(file_dir+'/profile_low'+dpName, function (err){
                        db.collection('Users').update({ _id : mongodb.ObjectId(uID)},{ $set : { DPPathLow : server_add+"/profile_low/"+filename }},function (err, docs){
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
                }            
            }); 
          }
        }
          
      }); 
      }      
    });
  });
  return router;
}
