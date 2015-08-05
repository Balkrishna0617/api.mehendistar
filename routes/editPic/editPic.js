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

router.post('/', function(req, res){													// post request handler on '/search' route 
	var pID = req.body.postID;															// getting the tagName to filter the response
	db.collection('Posts').find({ _id : mongodb.ObjectId(pID) }).toArray(function (err, docs){ // queries Posts table to get the most popular post from post
        if(err){
            logs.logError(err, req, res);
        }
        if(docs){
        	res.header("Content-Type:","application/json");
			res.send(docs);        	
        }			
	});
});

router.post('/update', function(req, res){													// post request handler on '/search' route 
	var pID = req.body.postID;
	var decs = req.body.description;
	var tag = req.body.tags;															// getting the tagName to filter the response
	// console.log("pid" , pID);
	// console.log("description" , req.body.description);
	// console.log("tags" , req.body.tags);
	db.collection('Posts').update({ _id : mongodb.ObjectId(pID)},{ $set : { description : decs, tags : tag }}, function(err, docs){ // queries Posts table to get the most popular post from post
		if(err){
            logs.logError(err, req, res);
        }
        if(docs){
        	res.send("success");	
        }		
	});
});
module.exports = router;