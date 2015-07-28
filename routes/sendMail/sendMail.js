module.exports = function(app){

  var express = require('express');
  var router = express.Router(); 
  var bodyParser = require('body-parser');
  var nodemailer = require("nodemailer");
  var config = require('../../config/config.json');
	// console.log("file_serving_dir", config.file_serving_dir);	
	// cofiguring body-parser
	router.use(bodyParser.json({	// setting json limit 	
	    limit: 1024 * 10000
	}));
	router.use(bodyParser.urlencoded({		// setting url encoding
	        extended: true
	}));

	var senderEmail = ""; var pwd = "";

	//var smtpTransport = nodemailer.createTransport("SMTP",{
	//host: "smtp.gmail.com",
	//port : "587",
	//auth: {
	//user: senderEmail,
	//pass: pwd
	//}
	//});
	var smtpTransport = nodemailer.createTransport("SMTP",{
		host: config.sender_email_host,
		port : config.sender_email_port,
		auth: {
			user: config.sender_email_add,
			pass: config.sender_email_pass
		}
	});
	// console.log(config.sender_email_host);
	router.post('/',function(req,res){
		var name = req.body.name;
		
		var Subject = "Feedback submitted by - " + name;
		var emailBody = "<b>Name:</b> " + req.body.name + ",<br/><b>Email:</b> " + req.body.email +",<br><b>Comment:</b> "+ req.body.comments;
		var mailOptions={
		to : config.reciever_email_add,
		subject : Subject,
		html : emailBody
		}
		// console.log(mailOptions);
		smtpTransport.sendMail(mailOptions, function(error, response){
		console.log(response);
		if(error){
		// console.log(error);
		// res.end("error");
		res.header("Content-Type:","application/json");
		res.send({"success" : "false"});
		}else{
		console.log("Message sent: " + response.message);
		res.header("Content-Type:","application/json");
		res.send({"success" : "true"});
		}
		});
	});

  return router;
}
