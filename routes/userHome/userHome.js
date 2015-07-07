var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var db = require('../../db_conn');              // Database Connection
 
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/', function(req, res){
	var uID = req.body.userID;
	db.collection('Users').findOne({ "_id" : mongodb.ObjectId(uID)}, function (err, user){
		res.header("Content-Type:","application/json");
		res.send(user);
	});
});

router.post('/post', function(req, res){
	var uID = req.body.userID;
	// console.log("user id : ", uID);
	db.collection('Posts').findOne({ "uid" : mongodb.ObjectId(uID)}, function (err, resl){		
		if(resl){
			// console.log("printing resl", resl);
			db.collection('Posts').find({ "uid" : mongodb.ObjectId(uID)}).toArray( function (err, result){
			var counter = 0;
			// console.log("printing result length", result.length);
					result.forEach(function(ress){
							db.collection('Likes').find({"uid" : mongodb.ObjectId(uID), "pid": mongodb.ObjectId(ress._id)}).toArray( function(err, likes){
								counter++;
								if(likes.length){
				                        ress.liked = true;
				                    }else{
				                        ress.liked = false;
				                    }
				                if(counter === result.length){
				                        result.sort(function(a,b){
				                            return b.uploadDate.getTime() - a.uploadDate.getTime();
				                        });
				                        res.header("Content-Type:","application/json");
				                        res.send(result);
				                    }
							});
					});
			});
		}else{
			res.header("Content-Type:","application/json");
	        res.send([{"message" : "No posts found."}]);
		}
	});
	
	// router.db.collection('Posts').find({ "uid" : mongodb.ObjectId(uID)}).sort({ uploadDate : -1 }).toArray( function (err, result){
	// 		var counter = 0;
	// 		console.log("printing result length", result.length);
	// 		// if(!result.length){
	// 		// 	console.log("printing result inside", result);
	// 		// 	res.header("Content-Type:","application/json");
	//   //           res.send({"message" : "No posts found."});
	// 		// } else {
	// 			result.forEach(function(ress){
	// 				router.db.collection('Likes').find({"uid" : mongodb.ObjectId(uID), "pid": mongodb.ObjectId(ress._id)}).toArray( function(err, likes){
	// 					counter++;
	// 					if(likes.length){
	// 	                        ress.liked = true;
	// 	                    }else{
	// 	                        ress.liked = false;
	// 	                    }
	// 	                if(counter === result.length){
	// 	                        result.sort(function(a,b){
	// 	                            return b.uploadDate.getTime() - a.uploadDate.getTime();
	// 	                        });
	// 	                        res.header("Content-Type:","application/json");
	// 	                        res.send(result);
	// 	                    }
	// 				});
	// 			});
	// 		// }
			
	// });
});

router.post('/like', function (req, res){
	var uID = req.body.userID;
	db.collection('Likes').findOne({ "uid" : mongodb.ObjectId(uID)}, function (err, resl){
		if (resl) {

			db.collection('Likes').find({ "uid" : mongodb.ObjectId(uID)}).toArray( function (err, result){
				likeArray = [];
				result.forEach( function(doc){
		 			 	likeArray.push(doc.pid);													// pop in userName and DPPath into initUsrName array
		 		});
		 		console.log("likeArray : ",likeArray);
		 		db.collection('Posts').find({ _id : { $in : likeArray }}).toArray( function (err, result){
		 			var cnt = 0;
		 			result.forEach( function(ress){
		 				cnt++
		 				ress.liked = true;
		 				if(cnt === result.length){
		 					res.header("Content-Type:","application/json");
							res.send(result);		
		 				}
		 			})
		 			 			
		 		});		
			});

		}else{
			res.header("Content-Type:","application/json");
	        res.send([{"message" : "No likes found."}]);
		}
	})


	
});

module.exports = router;