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
	var sesnID = req.body.sessionID;
	if (sesnID) {

		db.collection('Posts').find({ "uid" : mongodb.ObjectId(uID)}).sort({ uploadDate : -1 }).toArray( function (err, docs){
			var counter = 0;
            docs.forEach( function (doc){
            	db.collection('Likes').find({ uid : mongodb.ObjectId(sesnID), pid : mongodb.ObjectId(doc._id)}).toArray( function (err, likes){
            		counter++;
            		if(likes.length){
                        doc.liked = true;
                    }else{
                        doc.liked = false;
                    }

                    if(counter === docs.length){
                        docs.sort(function(a,b){
                            return b.uploadDate.getTime() - a.uploadDate.getTime();
                        });
                        res.header("Content-Type:","application/json");
                        res.send(docs);
                    } 
            	});
            });
			
		});

	}else{
		db.collection('Posts').find({ "uid" : mongodb.ObjectId(uID)}).sort({ uploadDate : -1 }).toArray( function (err, docs){
			docs.forEach(function (doc){
 			 	doc.liked = false;													// pop in userName and DPPath into initUsrName array
 			});	
			res.header("Content-Type:","application/json");
			res.send(docs);
		});
	}



	
});

router.post('/like', function (req, res){
	var uID = req.body.userID;
	var sesnID = req.body.sessionID;
	if (sesnID) {
		db.collection('Likes').findOne({ "uid" : mongodb.ObjectId(uID)}, function (err, resl){
			if(resl){

				db.collection('Likes').find({ "uid" : mongodb.ObjectId(uID)}).toArray( function (err, result){
					likeArray = [];
					result.forEach( function(doc){
			 			 	likeArray.push(doc.pid);													// pop in userName and DPPath into initUsrName array
			 		});
					db.collection('Posts').find({ _id : { $in : likeArray }}).toArray( function (err, docs){
						var counter = 0;
			            docs.forEach( function (doc){
			            	db.collection('Likes').find({ uid : mongodb.ObjectId(sesnID), pid : mongodb.ObjectId(doc._id)}).toArray( function (err, likes){
			            		counter++;
			            		if(likes.length){
			                        doc.liked = true;
			                    }else{
			                        doc.liked = false;
			                    }
			                    if(counter === docs.length){
			                        docs.sort(function(a,b){
			                            return b.uploadDate.getTime() - a.uploadDate.getTime();
			                        });
			                        res.header("Content-Type:","application/json");
			                        res.send(docs);
			                    } 
			            	});
			            });

			 		});
				});

			}else{
                res.header("Content-Type:","application/json");
                res.send([{"message" : "No data found."}]);
			}
		})

	}else{
		db.collection('Likes').findOne({ "uid" : mongodb.ObjectId(uID)}, function (err, resl){
			if(resl){
				db.collection('Likes').find({ "uid" : mongodb.ObjectId(uID)}).toArray( function (err, result){
					likeArray = [];
					result.forEach( function(doc){
			 			 	likeArray.push(doc.pid);													// pop in userName and DPPath into initUsrName array
			 		});
			 		// console.log("likeArray : ",likeArray);
			 		db.collection('Posts').find({ _id : { $in : likeArray }}).toArray( function (err, result){
			 			result.forEach(function (doc){
		 			 		doc.liked = false;													// pop in userName and DPPath into initUsrName array
		 				});	
			 			res.header("Content-Type:","application/json");
						res.send(result); 			
			 		});		
				});
			}else{
				res.header("Content-Type:","application/json");
                res.send([{"message" : "No data found."}]);
			}
		});
	}

});

module.exports = router;