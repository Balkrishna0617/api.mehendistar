// module.exports = function(app){

//   var express = require('express');
//   var router = express.Router();
//   var mongodb = require('mongodb'); 
//   var bodyParser = require('body-parser');
//   var fs = require('fs');
//   var lwip = require('lwip');                     // module for file compression
//   var db = require('../../../db_conn');              // Database Connection

//   // router.use(bodyParser.json());
//   // router.use(bodyParser.urlencoded({
//   //     extended: true
//   // }));
// router.use(bodyParser.urlencoded({
//     limit: '50mb',
//     extended: true
// }));
// router.use(bodyParser.json({ 
//     limit: '50mb'
// }));
// router.use(bodyParser.text({ 
//     limit: '50mb'
// }));
// router.use(bodyParser.raw({ 
//     limit: '50mb'
// }));

//   var done=false;
//   var postId;
//   var file_dir = app.get('file_serving_dir');
//   var server_add = app.get('server_addr');  
//   router.post('/photoCamera',function(req,res){
  
//     var uID = req.body.userID;
//     var desc = req.body.desc;
//     var tags = req.body.tagName;
//     var data = req.body.imageData;
//     // var uID = '55b7128a17757ca12aa291a9';
//     // var desc = 'CameraUpload';
//     // var tags = ['Common'];
    





//   // file upload code via 'fs' module.
//     var base64Data,
//     binaryData;

//     base64Data  =   data.replace(/^data:image\/jpeg;base64,/, "");
//     base64Data  +=  base64Data.replace('+', ' ');
//     binaryData  =   new Buffer(base64Data, 'base64').toString('binary');
//     var filename = "camera" + Date.now() + ".jpg";
//     var fileURL = file_dir+"/uploads/" + filename;
//       fs.writeFile(fileURL, binaryData, "binary", function (err) {
//           if (err) {
//             console.log(err); // writes out file without error, but it's not a valid image  
//           }else{
//             // console.log("outside query");
//             db.collection('Posts').insert({ "uid" : mongodb.ObjectId(uID), "description" : desc, "caption" : filename, "imagePath" : server_add+"/uploads/"+filename, "imagePathLow" : server_add+"/uploads_low/"+filename, "imagePathHigh" : server_add+"/uploads/"+filename, "tags" : tags, "cntLikes" : 0, "cntShares" : 0, "cntComments" : 0, "uploadDate" : new Date() }, function (err, docs){
//                 tags = ""; 
//                 if(err){
//                   console.log(err);
//                 }
//                 lwip.open(fileURL, function(err, image){
//                   var imgWidth = 1240;
//                   var aspect = image.width() / imgWidth;    
//                   image.batch()
//                     .resize(image.width()/aspect,image.height()/aspect)
//                     .writeFile(file_dir+'/uploads_low/' + filename, function(err){                
//                       // console.log(err);
                      
//                       if(err !== null){
//                         console.log("inside error");
//                         fs.unlink(fileURL, function(err){
//                             if (err) {
//                               console.error(err);
//                             }         
//                         });  
//                       }        
//                       });
//                 });
//                 // console.log("inside query");   
//             });
//             res.send("File uploaded.");
//                 // console.log("File uploaded."); 
//           }
//       });  
    
//   });
//   return router;
// };

module.exports = function(app){

  var express = require('express');
  var router = express.Router();
  var mongodb = require('mongodb'); 
  var bodyParser = require('body-parser');
  var fs = require('fs');
  var lwip = require('lwip');                     // module for file compression
  var db = require('../../../db_conn');              // Database Connection
  var logs = require('../../../logs/apiMehndiStar')();
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
  var postId;
  var file_dir = app.get('file_serving_dir');
  var server_add = app.get('server_addr');  
  router.post('/photoCamera',function(req,res){
  
    var uID = req.body.userID;
    var desc = req.body.desc;
    var tags = req.body.tagName;
    var data = req.body.imageData;
    // var uID = '55b7128a17757ca12aa291a9';
    // var desc = 'CameraUpload';
    // var tags = ['Common'];
    





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
             logs.logError(err, req, res); // writes out file without error, but it's not a valid image  
          }else{
            // console.log("outside query");
            db.collection('Posts').insert({ "uid" : mongodb.ObjectId(uID), "description" : desc, "caption" : filename, "imagePath" : server_add+"/uploads/"+filename, "imagePathLow" : server_add+"/uploads_low/"+filename, "imagePathHigh" : server_add+"/uploads/"+filename, "tags" : tags, "cntLikes" : 0, "cntShares" : 0, "cntComments" : 0, "uploadDate" : new Date() }, function (err, docs){
                tags = ""; 
                if(err){
                   logs.logError(err, req, res);
                }
                if(docs){
                  lwip.open(fileURL, function(err, image){
                    if(err){
                       logs.logError(err, req, res);
                    }
                    if(image){
                      var imgWidth = 1240;
                      var aspect = image.width() / imgWidth;    
                      image.batch()
                      .resize(image.width()/aspect,image.height()/aspect)
                      .writeFile(file_dir+'/uploads_low/' + filename, function(err){                
                        // console.log(err);
                        
                        if(err !== null){
                          console.log("inside error");
                          fs.unlink(fileURL, function(err){
                              if (err) {
                                console.error(err);
                              }         
                          });  
                        }        
                        });
                    }                      
                  });
                }                  
                // console.log("inside query");   
            });
            res.send("File uploaded."); 
            // console.log("File uploaded."); 
          }
      });      
  });
  return router;
};