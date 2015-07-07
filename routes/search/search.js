var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');               // DATABASE CONNECTIVITY MODULE
var bodyParser = require('body-parser');        // REQUEST BODY READER MODULE
var db = require('../../db_conn');              // Database Connection

//--------------------------------- Express Middleware ------------------------
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

// -------------------------------- Routes ------------------------------------
router.post('/', function(req, res){													                 // post request handler on '/search' route 
	var result = [];
	
	// var strt = parseInt(req.body.beg);														             // getting the beggining of respense
	var tagName = req.body.tagName;															                 // getting the tagName to filter the response	
	var uID = req.body.userID;													
	db.collection('Posts').find({tags : { $regex: ""+ tagName +"", $options: '-i' } },{ _id : 1, uid : 1, imagePath : 1, cntLikes : 1, cntComments : 1, uploadDate : 1 }).sort({ cntLikes : -1}).limit(1000).toArray(function(err, docs){ // Queries Posts table using regular expresssion to get the most popular post from Post
 		var counter = 0;
      docs.forEach( function (doc){
              db.collection('Users').findOne({ "_id" : mongodb.ObjectId(doc.uid)},{ _id : 1, userName : 1, DPPath : 1 }, function (err, user){
                  if (uID) {
                    db.collection('Likes').find({ uid : mongodb.ObjectId(uID), pid : mongodb.ObjectId(doc._id)}).toArray( function (err, likes){
                        counter++;
                        doc.uploader = user;
                        if(likes.length){
                            doc.liked = true;
                        }else{
                            doc.liked = false;
                        }
                        result.push(doc);                        
                        if(counter === docs.length){
                         res.header("Content-Type:","application/json");
                         res.send(result);
                        }
                    });  
                  } else {
                        counter++;
                        doc.uploader = user;
                        doc.liked = false;
                        result.push(doc);                        
                        if(counter === docs.length){
                         res.header("Content-Type:","application/json");
                         res.send(result);
                        } 
                  }
                  
                  
              });
      });    
	});
});
module.exports = router;