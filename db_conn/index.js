var mongodb = require('mongodb');
var db = new mongodb.Db('mehendistarDB', new mongodb.Server('127.0.0.1', 27017), { safe : true });

// =========================== Open database connection ==========================
db.open(function (err){
	if (err) {
		console.log('Error connecting to database mehendiDB...',err);
	}
});
module.exports = db;
