var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var db = require('../../../db_conn');              // Database Connection

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

var imageResult = {};
var liked = false;

function isLiked(uID,pID){
	db.collection('Likes').find({ uid : mongodb.ObjectId(uID), pid : mongodb.ObjectId(pID)}).toArray( function (err, docs){
		if(docs.length){
			imageResult.liked = true;
		}else{
			imageResult.liked = false;
		}
	});
}
function incrementLikes(pID){
	db.collection('Posts').update({ _id : mongodb.ObjectId(pID) }, { $inc : { cntLikes : 1 }}, function(err, docs){
		if(docs.length){
		// console.log("like count incremented...");
		}
	});
}
function decrementLikes(pID){
	db.collection('Posts').update({ _id : mongodb.ObjectId(pID) }, { $inc : { cntLikes : -1 }}, function(err, docs){
		if(docs.length){
		// console.log("like count decremented...");
		}
	});
}


router.post('/', function(req, res){
	var pID = req.body.postID;
	var uID = req.body.userID;
	// console.log("postID is : ", pID);
	// console.log("userID is : ", uID);
	if(uID){
		imageResult = {};
		db.collection('Likes').find({ uid : mongodb.ObjectId(uID), pid : mongodb.ObjectId(pID)}).toArray( function (err, docs){
			if(docs.length){
				imageResult.liked = true;
			}else{
				imageResult.liked = false;
			}

		db.collection('Posts').findOne({_id: mongodb.ObjectId(pID)},{ _id : 1,uid : 1, imagePath : 1, imagePathLow : 1, imagePathHigh : 1, description : 1, cntLikes : 1, cntComments : 1, uploadDate : 1 }, function (err, docs){
			db.collection('Users').findOne({_id : mongodb.ObjectId(docs.uid)},{DPPath : 1, DPPathLow : 1, DPPathHigh : 1, userName : 1}, function (err, user){
				imageResult.postId = docs._id;
				imageResult.uid = docs.uid;
				imageResult.imagePath = docs.imagePath;
				imageResult.imagePathLow = docs.imagePathLow;
				imageResult.imagePathHigh = docs.imagePathHigh;
				imageResult.des = docs.description;
				imageResult.cntLikes = docs.cntLikes;
				imageResult.cntComments = docs.cntComments;
				imageResult.uploadDate = docs.uploadDate;
				imageResult.userName = user.userName;
				imageResult.DPPath = user.DPPath;
				imageResult.DPPathLow = user.DPPathLow;
				imageResult.DPPathHigh = user.DPPathHigh;
				res.send(imageResult);
			});
		});
	});	
	}else{
		imageResult = {};
		db.collection('Posts').findOne({_id: mongodb.ObjectId(pID)},{ _id : 1, uid : 1,  imagePath : 1, imagePathLow : 1, imagePathHigh : 1, description : 1, cntLikes : 1, cntComments : 1, uploadDate : 1 }, function (err, docs){
		
			db.collection('Users').findOne({_id : mongodb.ObjectId(docs.uid)},{DPPath : 1, DPPathLow : 1, DPPathHigh : 1, userName : 1}, function (err, user){
				imageResult.liked = false;
				imageResult.postId = docs._id;
				imageResult.uid = docs.uid;
				imageResult.imagePath = docs.imagePath;
				imageResult.imagePathLow = docs.imagePathLow;
				imageResult.imagePathHigh = docs.imagePathHigh;
				imageResult.des = docs.description;
				imageResult.cntLikes = docs.cntLikes;
				imageResult.cntComments = docs.cntComments;
				imageResult.uploadDate = docs.uploadDate;
				imageResult.userName = user.userName;
				imageResult.DPPath = user.DPPath;
				imageResult.DPPathLow = user.DPPathLow;
				imageResult.DPPathHigh = user.DPPathHigh;
				res.send(imageResult);
			});
		});	

	}
	
			
});

router.post('/likeClicked', function(req, res){
	var pid = req.body.postID;
	var uid = req.body.userID;
	db.collection('Posts').update({ _id : mongodb.ObjectId(pid) }, { $inc : { cntLikes : 1 }}, function(err, post){

		db.collection('Likes').insert({ "pid" : mongodb.ObjectId(pid), "uid" : mongodb.ObjectId(uid) },function (err, docs){
			if(docs){
				res.send("success");
			}else{
				res.send("failure");	
			}
		});		
	});
});
router.post('/unlikeClicked', function(req, res){
	var pid = req.body.postID;
	var uid = req.body.userID;
	db.collection('Posts').update({ _id : mongodb.ObjectId(pid) }, { $inc : { cntLikes : -1 }}, function(err, post){
		
		db.collection('Likes').remove({ "pid" : mongodb.ObjectId(pid), "uid" : mongodb.ObjectId(uid) }, 1 ,function (err, docs){
			res.send("success");
		});
	});	
});


module.exports = router;
