var mongodb = require('mongodb');
var db = new mongodb.Db('mehendiDB', new mongodb.Server('127.0.0.1', 27017), { safe : true });

db.open(function (err){
	if (err) {
		console.log('Error connecting to database mehendiDB...');
	}
});
module.exports = db;