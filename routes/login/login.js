module.exports = function(app){

	var express = require('express');
	var router = express.Router();
	var mongodb = require('mongodb');
	var bodyParser = require('body-parser');
	var db = require('../../db_conn');              // Database Connection

	router.use(bodyParser.json());
	router.use(bodyParser.urlencoded({
	    extended: true
	}));

	var file_dir = app.get('file_serving_dir');
	var server_add = app.get('server_addr');
	router.post('/',function(req, res){
		var userNm = req.body.userName;
		var emailID = req.body.email;
		var gen = req.body.gender;
		var facebookId = req.body.fbId;
		console.log("user name : ", userNm);
		console.log("email address : ", emailID);
		db.collection('Users').find({ email : emailID }).toArray( function (err, docs){
			if(docs[0]){
				console.log(docs[0]);
				res.header("Content-Type:","application/json");
				res.send(docs[0]);	
			}else{
				db.collection('Users').insert({ "userName" : userNm, "email" : emailID, "gender" : gen, "age" : 0, "DPPath" : server_add+'/profile/Profile-Icon.png', "fbId" : facebookId }, function (err, docs){
					db.collection('Users').find({ email : emailID }).toArray( function (err, docs){
						res.header("Content-Type:","application/json");
						res.send(docs[0]);		
					});	
				});	
			}	
		});
	});

	return router;
}