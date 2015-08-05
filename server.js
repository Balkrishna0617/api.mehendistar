var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logs = require('./logs/apiMehndiStar')();
var config = require('./config/config.json');
app.set('file_serving_dir',config.file_serving_dir_local);
app.set('server_addr',config.server_addr_local);
// app.set('file_serving_dir',config.file_serving_dir);
// app.set('server_addr',config.server_addr);

//----------------------------/v1 api imports --------------------------------------
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
var testRoute = require('./routes/testRoute/testRoute')(app);

//---------------------------------- /v2 api imports ----------------------------------
var v2home = require('./routes/v2/home/index');
var v2search = require('./routes/v2/search/search');
var v2clickImage = require('./routes/v2/clickImage/clickImage');
var v2comments = require('./routes/v2/comments/comments');
var v2editPic = require('./routes/v2/editPic/editPic');
var v2login = require('./routes/v2/login/login')(app);
var v2userHome = require('./routes/v2/userHome/userHome');
var v2userProfile = require('./routes/v2/userProfile/userProfile');
var v2uploadImage = require('./routes/v2/uploadImage/uploadImage')(app);
var v2uploadImageCamera = require('./routes/v2/uploadImageCamera/uploadImageCamera')(app);
var v2profilePic = require('./routes/v2/profilePic/profilePic')(app);
var v2profilePicCamera = require('./routes/v2/profilePicCamera/profilePicCamera')(app);
var v2sendMail = require('./routes/v2/sendMail/sendMail')(app);
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
app.use('/send',sendMail);
app.use('/testRoute',testRoute);

//--------------------------------- /v2 api route ------------------------------
app.use('/v2/', v2home);
app.use('/v2/search',v2search);
app.use('/v2/clickImage',v2clickImage);
app.use('/v2/comments',v2comments);
app.use('/v2/editPic',v2editPic);
app.use('/v2/login',v2login);
app.use('/v2/userHome',v2userHome);
app.use('/v2/userProfile',v2userProfile);
app.use('/v2/api',v2uploadImage);
app.use('/v2/apiCamera',v2uploadImageCamera);
app.use('/v2/profilePic',v2profilePic);
app.use('/v2/profilePicCamera',v2profilePicCamera);
app.use('/v2/send',v2sendMail);
//--------------------------------- Ports and IP Address --------------
var port = 8181;
// var ip = '127.0.0.1';
app.listen(port,function(err){
	if (err) {
    
		// console.log(err);
	}else{
		
    // console.log(logs.toString());
    console.log("App is running on port : "+ port);
	}	
});

