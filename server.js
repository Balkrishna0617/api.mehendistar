var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config/config.json');
// app.set('file_serving_dir','/home/devnode/uploads/mehendistar');
// app.set('server_addr','http://api.mehndistar.com');

// console.log("file_serving_dir", config.file_serving_dir);


var home = require('./routes/home/index');
var search = require('./routes/search/search');
var clickImage = require('./routes/clickImage/clickImage');
var comments = require('./routes/comments/comments');
var editPic = require('./routes/editPic/editPic');
var login = require('./routes/login/login')(app);
var userHome = require('./routes/userHome/userHome');
var userProfile = require('./routes/userProfile/userProfile');
var uploadImage = require('./routes/uploadImage/uploadImage')(app);
var uploadImageCamera = require('./routes/uploadImageCamera/uploadImageCamera')(app);
var profilePic = require('./routes/profilePic/profilePic')(app);
var profilePicCamera = require('./routes/profilePicCamera/profilePicCamera')(app);
var sendMail = require('./routes/sendMail/sendMail')(app);
//--------------------------------- Middlewares ---------------------------------
app.use(bodyParser.json({ 
    limit: '50mb'
}));
app.use(bodyParser.text({ 
    limit: '50mb'
}));
app.use(bodyParser.raw({ 
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
        extended: true
}));
// var file_dir = app.get('file_serving_dir');
// app.use(express.static(file_dir));												//static file directory
app.use(function(req, res, next) {												// CORS Issue Fix
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//--------------------------------- Routes --------------------------------------
app.use('/', home);
app.use('/search',search);
app.use('/clickImage',clickImage);
app.use('/comments',comments);
app.use('/editPic',editPic);
app.use('/login',login);
app.use('/userHome',userHome);
app.use('/userProfile',userProfile);
app.use('/api',uploadImage);
app.use('/apiCamera',uploadImageCamera);
app.use('/profilePic',profilePic);
app.use('/profilePicCamera',profilePicCamera);
app.use('/send',sendMail);

//--------------------------------- Ports and IP Address --------------
var port = 8181;
// var ip = '127.0.0.1';
app.listen(port,function(err){
	if (err) {
		console.log(err);
	}else{
		console.log("App is running on port : "+ port);
	}	
});

