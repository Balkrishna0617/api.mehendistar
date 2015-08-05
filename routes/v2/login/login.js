// module.exports = function(app){

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

// var file_dir = app.get('file_serving_dir');
// var server_add = app.get('server_addr');
// router.post('/',function(req, res){
// 	var userNm = req.body.userName;
// 	var emailID = req.body.email;
// 	var gen = req.body.gender;
// 	var accStat = "Active";
// 	// console.log("user name : ", userNm);
// 	// console.log("email address : ", emailID);
// 	db.collection('Users').find({ email : emailID }).toArray( function (err, docs){
// 		if(docs[0]){
// 			// console.log(docs[0]);
// 			res.header("Content-Type:","application/json");
// 			res.send(docs[0]);	
// 		}else{
// 			db.collection('Users').insert({ "userName" : userNm, "email" : emailID, "gender" : gen, "DPPath" : server_add+'/profile/Profile-Icon.png', "DPPathLow" : server_add+'/profile_low/Profile-Icon.png', "DPPathHigh" : server_add+'/profile/Profile-Icon.png', "status" : accStat }, function (err, docs){
// 				db.collection('Users').find({ email : emailID }).toArray( function (err, docs){
// 					res.header("Content-Type:","application/json");
// 					res.send(docs[0]);		
// 				});	
// 			});	
// 		}	
// 	});
// });

// return router;
// }
module.exports = function(app){

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

var file_dir = app.get('file_serving_dir');
var server_add = app.get('server_addr');
router.post('/',function(req, res){
	var userNm = req.body.userName;
	var emailID = req.body.email;
	var gen = req.body.gender;
	var accStat = "Active";
	// console.log("user name : ", userNm);
	// console.log("email address : ", emailID);
	db.collection('Users').find({ email : emailID }).toArray( function (err, docs){
		if(err){
            logs.logError(err, req, res);
        }
		if(docs[0]){
			// console.log(docs[0]);
			res.header("Content-Type:","application/json");
			res.send(docs[0]);	
		}else{
			db.collection('Users').insert({ "userName" : userNm, "email" : emailID, "gender" : gen, "DPPath" : server_add+'/profile/Profile-Icon.png', "DPPathLow" : server_add+'/profile_low/Profile-Icon.png', "DPPathHigh" : server_add+'/profile/Profile-Icon.png', "status" : accStat }, function (err, docs){
				if(err){
		            logs.logError(err, req, res);
		        }
		        if(docs){
					db.collection('Users').find({ email : emailID }).toArray( function (err, docs){
						if(err){
				            logs.logError(err, req, res);
				        }
				        if(docs){
				        	res.header("Content-Type:","application/json");
							res.send(docs[0]);		
				        }						
					});			        	
		        }

			});	
		}	
	});
});

return router;
}