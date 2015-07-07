var express = require('express');
var app = express();
app.set('file_serving_dir','/home/balkrishna/workdata/images');
app.set('server_addr','http://192.168.2.135:3000');
var home = require('./routes/home/index');
var search = require('./routes/search/search');
var clickImage = require('./routes/clickImage/clickImage');
var comments = require('./routes/comments/comments');
var editPic = require('./routes/editPic/editPic');
var login = require('./routes/login/login');
var userHome = require('./routes/userHome/userHome');
var userProfile = require('./routes/userProfile/userProfile');
var uploadImage = require('./routes/uploadImage/uploadImage')(app);
var uploadImageCamera = require('./routes/uploadImageCamera/uploadImageCamera')(app);
var profilePic = require('./routes/profilePic/profilePic')(app);
var profilePicCamera = require('./routes/profilePicCamera/profilePicCamera')(app);

//--------------------------------- Middlewares ---------------------------------

var file_dir = app.get('file_serving_dir');
app.use(express.static(file_dir));												//static file directory
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

//--------------------------------- Openshift Ports and IP Address --------------
var port = 3000;
var ip = '192.168.2.135';
app.listen(port,ip,function(err){
	if (err) {
		console.log(err);
	}else{
		console.log("App is running on  IP address : " + ip + " port : "+ port);
	}	
});

