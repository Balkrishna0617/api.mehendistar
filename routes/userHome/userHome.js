var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
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

router.post('/', function(req, res){
	var uID = req.body.userID;
	db.collection('Users').findOne({ "_id" : mongodb.ObjectId(uID)}, function (err, user){
		if(err){
            logs.logError(err, req, res);
        }
        if(user){
	        res.header("Content-Type:","application/json");
			res.send(user);	
        }		
	});
});


router.post('/post', function(req, res){
	var uID = req.body.userID;
	// console.log("user id : ", uID);
	db.collection('Posts').findOne({ "uid" : mongodb.ObjectId(uID)}, function (err, resl){		
		if(err){
            logs.logError(err, req, res);
        }
		if(resl){
			// console.log("printing resl", resl);
			db.collection('Posts').find({ "uid" : mongodb.ObjectId(uID)}).toArray( function (err, result){
				if(err){
		            logs.logError(err, req, res);
		        }
		        if(result){
					db.collection("Users").find({"_id" : mongodb.ObjectId(uID)}).toArray( function (err, user){
						if(err){
				            logs.logError(err, req, res);
				        }
				        if(user){
				        	var username = user[0].userName;
							var DPpath = user[0].DPPath;
							var DPpathLow = user[0].DPPathLow;
							var DPpathHigh = user[0].DPPathHigh;
							var counter = 0;
							// console.log("printing result length", result.length);
							result.forEach(function(ress){
									db.collection('Likes').find({"uid" : mongodb.ObjectId(uID), "pid": mongodb.ObjectId(ress._id)}).toArray( function(err, likes){
										if(err){
								            logs.logError(err, req, res);
								        }
								        if(likes){
								        	counter++;
											if(likes.length){
							                        ress.liked = true;
							                    }else{
							                        ress.liked = false;
							                    }
							                    ress.userName = username;
							                    ress.DPPath = DPpath;
							                    ress.DPPathLow = DPpathLow;
							                    ress.DPPathHigh = DPpathHigh;
							                if(counter === result.length){
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
		        }				
			});
		}else{
			res.header("Content-Type:","application/json");
	        res.send([{"message" : "No posts found."}]);
		}
	});
});



router.post('/like', function (req, res){
	var uID = req.body.userID;
	db.collection('Likes').findOne({ "uid" : mongodb.ObjectId(uID)}, function (err, resl){
		if(err){
            logs.logError(err, req, res);
        }
		if (resl) {

			db.collection('Likes').find({ "uid" : mongodb.ObjectId(uID)}).toArray( function (err, result){
				if(err){
		            logs.logError(err, req, res);
		        }
		        if(result){
			        likeArray = [];
					result.forEach( function(doc){
			 			 	likeArray.push(doc.pid);													// pop in userName and DPPath into initUsrName array
			 		});
			 		// console.log("likeArray : ",likeArray);
			 		db.collection('Posts').find({ _id : { $in : likeArray }}).toArray( function (err, result){
			 			if(err){
				            logs.logError(err, req, res);
				        }
				        if(result){
				        	var cnt = 0;
				 			result.forEach( function(ress){
				 				db.collection("Users").find({"_id" : mongodb.ObjectId(ress.uid)}).toArray( function (err, user){
									if(err){
							            logs.logError(err, req, res);
							        }
							        if(user){
							        	var username = user[0].userName;
										var DPpath = user[0].DPPath;
										var DPpathLow = user[0].DPPathLow;
										var DPpathHigh = user[0].DPPathHigh;
										cnt++
						 				ress.liked = true;
						 				ress.userName = username;
						 				ress.DPPath = DPpath;
						 				ress.DPPathLow = DPpathLow;
						 				ress.DPPathHigh = DPpathHigh;
						 				if(cnt === result.length){
						 					res.header("Content-Type:","application/json");
											res.send(result);		
						 				}	
							        }										
								});					 			
				 			})				        	
				        }			 			 			
			 		});	
		        }				
			});

		}else{
			res.header("Content-Type:","application/json");
	        res.send([{"message" : "No likes found."}]);
		}
	})


	
});

module.exports = router;
