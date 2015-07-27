var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var db = require('../../db_conn');              // Database Connection

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/', function(req, res){													// post request handler on '/search' route 
	var pID = req.body.postID;															// getting the tagName to filter the response
	db.collection('Posts').find({ _id : mongodb.ObjectId(pID) }).toArray(function (err, docs){ // queries Posts table to get the most popular post from post
		res.header("Content-Type:","application/json");
		res.send(docs);
	});
});

router.post('/update', function(req, res){													// post request handler on '/search' route 
	var pID = req.body.postID;															// getting the tagName to filter the response
	// console.log("pid" , pID);
	// console.log("description" , req.body.description);
	// console.log("tags" , req.body.tags);
	db.collection('Posts').update({ _id : mongodb.ObjectId(pID)},{ $set : { description : req.body.description, tags : req.body.tags }}, function(err, docs){ // queries Posts table to get the most popular post from post
		res.send("success");
	});
});
module.exports = router;