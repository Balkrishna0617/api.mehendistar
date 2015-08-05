// var express = require('express');
// var router = express.Router();
// var mongodb = require('mongodb');               // DATABASE CONNECTIVITY MODULE
// var bodyParser = require('body-parser');        // REQUEST BODY READER MODULE
// var db = require('../../../db_conn');           // Database Connection

// //--------------------------------- Express Middleware ------------------------
// // router.use(bodyParser.json());
// // router.use(bodyParser.urlencoded({
// //     extended: true
// // }));
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

// // -------------------------------- Routes ------------------------------------
// router.post('/recent', function (req, res){                                     // Sending post with date and time filter (recent post first)
//     var result = [];
//     var tagName = req.body.tagName;
//     var uID = req.body.userID;
//     if (uID) {                                                                  // If user is logged in send response with liked status
//         db.collection('Posts').findOne({tags : tagName},function (err, resl){
//             if(resl){

//                 db.collection('Posts').find({ tags : tagName },{ _id : 1, uid : 1, imagePath : 1, imagePathLow : 1, imagePathHigh : 1, cntLikes : 1, cntComments : 1, uploadDate : 1}).limit(1000).sort({ uploadDate : -1 }).toArray(function(err, docs) {
//                 var counter = 0;
//                     docs.forEach( function (doc){
//                         db.collection('Users').findOne({ "_id" : mongodb.ObjectId(doc.uid)},{ _id : 1, userName : 1, DPPath : 1, DPPathLow : 1, DPPathHigh : 1 }, function (err, user){
                            
//                             db.collection('Likes').find({ uid : mongodb.ObjectId(uID), pid : mongodb.ObjectId(doc._id)}).toArray( function (err, likes){
//                                 counter++;
//                                 doc.uploader = user;
//                                 if(likes.length){
//                                     doc.liked = true;
//                                 }else{
//                                     doc.liked = false;
//                                 }
//                                 result.push(doc);                        
//                                 if(counter === docs.length){
//                                     result.sort(function(a,b){
//                                         return b.uploadDate.getTime() - a.uploadDate.getTime();
//                                     });
//                                     res.header("Content-Type:","application/json");
//                                     res.send(result);
//                                 }
//                             });
//                         });
//                     });        
//                 });

//             }else{
//                 res.header("Content-Type:","application/json");
//                 res.send([{"message" : "No data found."}]);
//             }
//         });

//     }else{                                                                      // If user is not logged in send response with like status false
//         db.collection('Posts').findOne({tags : tagName},function (err, resl){
//             if(resl){

//                 db.collection('Posts').find({ tags : tagName },{ _id : 1, uid : 1, imagePath : 1, imagePathLow : 1, imagePathHigh : 1, cntLikes : 1, cntComments : 1, uploadDate : 1}).limit(1000).sort({ uploadDate : -1 }).toArray(function(err, docs) {
//                 var counter = 0;
//                     docs.forEach( function (doc){
//                         db.collection('Users').findOne({ "_id" : mongodb.ObjectId(doc.uid)},{ _id : 1, userName : 1, DPPath : 1, DPPathLow : 1, DPPathHigh : 1 }, function (err, user){
//                                 counter++;
//                                 doc.uploader = user;
//                                 doc.liked = false;                        
//                                 result.push(doc);                        
//                                 if(counter === docs.length){
//                                     result.sort(function(a,b){
//                                         return b.uploadDate.getTime() - a.uploadDate.getTime();
//                                     });
//                                     res.header("Content-Type:","application/json");
//                                     res.send(result);
//                                 }
//                         });
//                     });        
//                 });

//             } else{
//                 res.header("Content-Type:","application/json");
//                 res.send([{"message" : "No data found."}]);
//             }
//         });
//     }
// });

// router.post('/popular', function (req, res){                                    // sending post with likes count filter (most no. of liked post first)
//     var result = [];
//     var tagName = req.body.tagName;
//     var uID = req.body.userID;

//     if (uID) {                                                                  // If user is logged in send response with liked status
//             db.collection('Posts').findOne({tags : tagName},function (err, resl){
//                 if(resl){
//                     db.collection('Posts').find({ tags : tagName },{ _id : 1, uid : 1, imagePath : 1, imagePathLow : 1, imagePathHigh : 1, cntLikes : 1, cntComments : 1, uploadDate : 1}).limit(1000).sort({ cntLikes : -1 }).toArray(function(err, docs) {
//                         var counter = 0;
//                             docs.forEach( function (doc){      
//                                     db.collection('Users').findOne({ "_id" : mongodb.ObjectId(doc.uid)},{ _id : 1, userName : 1, DPPath : 1, DPPathLow : 1, DPPathHigh : 1 }, function (err, user){
                                            
//                                         db.collection('Likes').find({ uid : mongodb.ObjectId(uID), pid : mongodb.ObjectId(doc._id)}).toArray( function (err, likes){
//                                             counter++;
//                                             doc.uploader = user;
//                                             if(likes.length){
//                                                 doc.liked = true;
//                                             }else{
//                                                 doc.liked = false;
//                                             }
//                                             result.push(doc);                                                       
//                                             if(counter === docs.length){                                     
//                                                  result.sort(function(a,b){
//                                                  return b.cntLikes - a.cntLikes;
//                                                  });
//                                                  res.header("Content-Type:","application/json");
//                                                  res.send(result);    
//                                             }

//                                         });

//                                     });
//                             });        
//                     });                    
//                 }else{
//                     res.header("Content-Type:","application/json");
//                     res.send([{"message" : "No data found."}]);
//                 }        
//             });

//     }else{                                                                      // If user is not logged in send response with like status false
//             db.collection('Posts').findOne({tags : tagName},function (err, resl){
//                 if(resl){
//                     db.collection('Posts').find({ tags : tagName },{ _id : 1, uid : 1, imagePath : 1, imagePathLow : 1, imagePathHigh : 1, cntLikes : 1, cntComments : 1, uploadDate : 1}).limit(1000).sort({ cntLikes : -1 }).toArray(function(err, docs) {
//                         var counter = 0;
//                             docs.forEach( function (doc){      
//                                     db.collection('Users').findOne({ "_id" : mongodb.ObjectId(doc.uid)},{ _id : 1, userName : 1, DPPath : 1, DPPathLow : 1, DPPathHigh : 1 }, function (err, user){
//                                             counter++;
//                                             doc.uploader = user;
//                                             doc.liked = false;
//                                             result.push(doc);                                                       
//                                             if(counter === docs.length){                                     
//                                                  result.sort(function(a,b){
//                                                  return b.cntLikes - a.cntLikes;
//                                                  });
//                                                  res.header("Content-Type:","application/json");
//                                                  res.send(result);    
//                                             }

//                                     });
//                             });        
//                     });
//                 }else{
//                     res.header("Content-Type:","application/json");
//                     res.send([{"message" : "No data found."}]);
//                 }
//             });
//     }    
// });

// module.exports = router;

var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');               // DATABASE CONNECTIVITY MODULE
var bodyParser = require('body-parser');        // REQUEST BODY READER MODULE
var db = require('../../../db_conn');              // Database Connection
var logs = require('../../../logs/apiMehndiStar')();
//--------------------------------- Express Middleware ------------------------
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

// -------------------------------- Routes ------------------------------------
router.post('/recent', function (req, res){                                     // Sending post with date and time filter (recent post first)
    
    var result = [];
    var tagName = req.body.tagName;
    var uID = req.body.userID;
    if (uID) {                                                                  // If user is logged in send response with liked status
        db.collection('Posts').findOne({tags : tagName},function (err, resl){
            // var err = new Error("This is custom message");
            if(err){
                logs.logError(err, req, res);
            }
            if(resl){

                db.collection('Posts').find({ tags : tagName },{ _id : 1, uid : 1, imagePath : 1, imagePathLow : 1, imagePathHigh : 1, cntLikes : 1, cntComments : 1, uploadDate : 1}).limit(1000).sort({ uploadDate : -1 }).toArray(function (err, docs) {
                    if(err){
                        logs.logError(err, req, res);
                    }
                    if(docs){
                        var counter = 0;
                        docs.forEach( function (doc){
                            db.collection('Users').findOne({ "_id" : mongodb.ObjectId(doc.uid)},{ _id : 1, userName : 1, DPPath : 1, DPPathLow : 1, DPPathHigh : 1 }, function (err, user){
                                if(err){
                                    logs.logError(err, req, res);
                                }    
                                if(user){
                                    db.collection('Likes').find({ uid : mongodb.ObjectId(uID), pid : mongodb.ObjectId(doc._id)}).toArray( function (err, likes){
                                        if(err){
                                            logs.logError(err, req, res);
                                        }
                                        if(likes){
                                            counter++;
                                            doc.uploader = user;
                                            if(likes.length){
                                                doc.liked = true;
                                            }else{
                                                doc.liked = false;
                                            }
                                            result.push(doc);                        
                                            if(counter === docs.length){
                                                result.sort(function(a,b){
                                                    return b.uploadDate.getTime() - a.uploadDate.getTime();
                                                });
                                                res.header("Content-Type:","application/json");
                                                res.send(result);
                                            }    
                                        }   
                                    });
                                }    
                            });
                        }); 
                    }
                });
            }else{
                res.header("Content-Type:","application/json");
                res.send([{"message" : "No data found."}]);
            }
        });

    }else{                                                                      // If user is not logged in send response with like status false
        db.collection('Posts').findOne({tags : tagName},function (err, resl){
            if(err){
                logs.logError(err, req, res);
            }
            if(resl){

                db.collection('Posts').find({ tags : tagName },{ _id : 1, uid : 1, imagePath : 1, imagePathLow : 1, imagePathHigh : 1, cntLikes : 1, cntComments : 1, uploadDate : 1}).limit(1000).sort({ uploadDate : -1 }).toArray(function (err, docs) {
                    if(err){
                        logs.logError(err, req, res);
                    }
                    if(docs){
                        var counter = 0;
                        docs.forEach( function (doc){
                            db.collection('Users').findOne({ "_id" : mongodb.ObjectId(doc.uid)},{ _id : 1, userName : 1, DPPath : 1, DPPathLow : 1, DPPathHigh : 1 }, function (err, user){
                                if(err){
                                    logs.logError(err, req, res);
                                }
                                if(user){
                                    counter++;
                                    doc.uploader = user;
                                    doc.liked = false;                        
                                    result.push(doc);                        
                                    if(counter === docs.length){
                                        result.sort(function(a,b){
                                            return b.uploadDate.getTime() - a.uploadDate.getTime();
                                        });
                                        res.header("Content-Type:","application/json");
                                        res.send(result);
                                    }                                
                                }
                            });
                        }); 
                    }       
                });
            } else{
                res.header("Content-Type:","application/json");
                res.send([{"message" : "No data found."}]);
            }
        });
    }
});

router.post('/popular', function (req, res){                                    // sending post with likes count filter (most no. of liked post first)
    var result = [];
    var tagName = req.body.tagName;
    var uID = req.body.userID;

    if (uID) {                                                                  // If user is logged in send response with liked status
            db.collection('Posts').findOne({tags : tagName},function (err, resl){
                if(err){
                    logs.logError(err, req, res);
                }
                if(resl){
                    db.collection('Posts').find({ tags : tagName },{ _id : 1, uid : 1, imagePath : 1, imagePathLow : 1, imagePathHigh : 1, cntLikes : 1, cntComments : 1, uploadDate : 1}).limit(1000).sort({ cntLikes : -1 }).toArray(function(err, docs) {
                        if(err){
                            logs.logError(err, req, res);
                        }
                        if(docs){
                            var counter = 0;
                            docs.forEach( function (doc){      
                                db.collection('Users').findOne({ "_id" : mongodb.ObjectId(doc.uid)},{ _id : 1, userName : 1, DPPath : 1, DPPathLow : 1, DPPathHigh : 1 }, function (err, user){
                                    if(err){
                                        logs.logError(err, req, res);
                                    }
                                    if(user){
                                        db.collection('Likes').find({ uid : mongodb.ObjectId(uID), pid : mongodb.ObjectId(doc._id)}).toArray( function (err, likes){
                                            if(err){
                                                logs.logError(err, req, res);
                                            }
                                            if(likes){
                                                counter++;
                                                doc.uploader = user;
                                                if(likes.length){
                                                    doc.liked = true;
                                                }else{
                                                    doc.liked = false;
                                                }
                                                result.push(doc);                                                       
                                                if(counter === docs.length){                                     
                                                     result.sort(function(a,b){
                                                     return b.cntLikes - a.cntLikes;
                                                     });
                                                     res.header("Content-Type:","application/json");
                                                     res.send(result);    
                                                }
                                            }
                                        });
                                    }                                            
                                });
                            });
                        }        
                    });                    
                }else{
                    res.header("Content-Type:","application/json");
                    res.send([{"message" : "No data found."}]);
                }        
            });

    }else{                                                                      // If user is not logged in send response with like status false
            db.collection('Posts').findOne({tags : tagName},function (err, resl){
                if(err){
                    logs.logError(err, req, res);
                }
                if(resl){
                    db.collection('Posts').find({ tags : tagName },{ _id : 1, uid : 1, imagePath : 1, imagePathLow : 1, imagePathHigh : 1, cntLikes : 1, cntComments : 1, uploadDate : 1}).limit(1000).sort({ cntLikes : -1 }).toArray(function (err, docs) {
                        if(err){
                            logs.logError(err, req, res);
                        }
                        if(docs){
                            var counter = 0;
                            docs.forEach( function (doc){      
                                db.collection('Users').findOne({ "_id" : mongodb.ObjectId(doc.uid)},{ _id : 1, userName : 1, DPPath : 1, DPPathLow : 1, DPPathHigh : 1 }, function (err, user){
                                        if(err){
                                            logs.logError(err, req, res);
                                        }
                                        if(user){
                                            counter++;
                                            doc.uploader = user;
                                            doc.liked = false;
                                            result.push(doc);                                                       
                                            if(counter === docs.length){                                     
                                                 result.sort(function(a,b){
                                                 return b.cntLikes - a.cntLikes;
                                                 });
                                                 res.header("Content-Type:","application/json");
                                                 res.send(result);    
                                            }                                                
                                        }
                                });
                            }); 
                        }    
                                   
                    });
                }else{
                    res.header("Content-Type:","application/json");
                    res.send([{"message" : "No data found."}]);
                }
            });
    }    
});

module.exports = router;