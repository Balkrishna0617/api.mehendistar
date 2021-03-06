// var express = require('express');
// var router = express.Router();
// var mongodb = require('mongodb');
// var bodyParser = require('body-parser');
// var db = require('../../../db_conn');              // Database Connection

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

// router.post('/', function (req, res){
// 	var result = [];

// 	var pID = req.body.postID;
// 	// console.log("Recieved Post ID : " + req.body.postID);
// 	db.collection('Comments').find({ pid : mongodb.ObjectId(pID)},{ "_id" : 1, "uid" : 1, "comment" : 1, "commentDate" : 1 }).toArray( function ( err, docs){
// 	if(docs.length == 0){
// 		res.header("Content-Type:","application/json");
//         res.send({"msg" : "no comments"});
// 	}	
// 	var counter = 0;
//         docs.forEach( function (doc){
//                 db.collection('Users').findOne({ "_id" : mongodb.ObjectId(doc.uid)},{ _id : 1, userName : 1, DPPath : 1, DPPathLow : 1, DPPathHigh : 1 }, function (err, user){
//                     counter++;
//                     doc.UserInfo = user;
// 					result.push(doc);                        
//                     if(counter === docs.length){
//                     	result.sort(function(a,b){
//                     		return a.commentDate.getTime() - b.commentDate.getTime();
//                     	});
// 	                    res.header("Content-Type:","application/json");
// 	                    res.send(result);
//                     }
//             });
//         });  
// 	});
// });

// router.post('/post',function(req,res){
// 	var pID = req.body.postID;
// 	var uID = req.body.userID;
// 	var comment = req.body.comment;
// 	db.collection('Posts').update({ _id : mongodb.ObjectId(pID) }, { $inc : { cntComments : 1 }}, function(err, docs){
		
// 		db.collection('Comments').insert({"uid" : mongodb.ObjectId(uID), "pid" : mongodb.ObjectId(pID), "comment" : comment, "commentDate" : new Date() }, function(err, docs){
// 			res.send("Comment posted successfully....");
// 		});
// 	});		
// });

// module.exports = router;
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
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

router.post('/', function (req, res){
	var result = [];

	var pID = req.body.postID;
	// console.log("Recieved Post ID : " + req.body.postID);
	db.collection('Comments').find({ pid : mongodb.ObjectId(pID)},{ "_id" : 1, "uid" : 1, "comment" : 1, "commentDate" : 1 }).toArray( function ( err, docs){
	if(err){
        logs.logError(err, req, res);
    }
	if(docs.length == 0){
		res.header("Content-Type:","application/json");
        res.send({"msg" : "no comments"});
	}	
	var counter = 0;
        docs.forEach( function (doc){
                db.collection('Users').findOne({ "_id" : mongodb.ObjectId(doc.uid)},{ _id : 1, userName : 1, DPPath : 1, DPPathLow : 1, DPPathHigh : 1 }, function (err, user){
                    if(err){
		                logs.logError(err, req, res);
		            }
		            if(user){
			            counter++;
	                    doc.UserInfo = user;
						result.push(doc);                        
	                    if(counter === docs.length){
	                    	result.sort(function(a,b){
	                    		return a.commentDate.getTime() - b.commentDate.getTime();
	                    	});
		                    res.header("Content-Type:","application/json");
		                    res.send(result);
	                    }	
		            }                    
            });
        });  
	});
});

router.post('/post',function(req,res){
	var pID = req.body.postID;
	var uID = req.body.userID;
	var comment = req.body.comment;
	db.collection('Posts').update({ _id : mongodb.ObjectId(pID) }, { $inc : { cntComments : 1 }}, function(err, docs){
		if(err){
            logs.logError(err, req, res);
        }
		db.collection('Comments').insert({"uid" : mongodb.ObjectId(uID), "pid" : mongodb.ObjectId(pID), "comment" : comment, "commentDate" : new Date() }, function(err, docs){
			if(err){
	            logs.logError(err, req, res);
	        }
	        if(docs){
	        	res.send("Comment posted successfully....");	
	        }			
		});
	});		
});

module.exports = router;
