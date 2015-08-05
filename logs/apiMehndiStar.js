var fs= require('fs');

var logObj = function (){
	this.filename = function(){
		var date = new Date();
		var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
		var dt = date.getDate() < 10 ? '0'+date.getDate() : date.getDate()
		var dateStr = date.getFullYear().toString() + month + dt;
		return dateStr;
	}
	this.formatAMPM = function (date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
		var dt = date.getDate() < 10 ? '0'+date.getDate() : date.getDate()
		var dateStr = date.getFullYear().toString() + '-' + month + '-' + dt + ' @ ';
		var strTime = dateStr + hours + ':' + minutes + ' ' + ampm + ' - ';
		return strTime;
	}
	this.logError = function(err, req, res){
		var errorTime = this.formatAMPM(new Date());
		var printErr = errorTime+err.stack;
		var today = this.filename() + '.log';		
			fs.open('./logs/log/'+today,'a', function(err, fd){
				var writeBuffer = new Buffer (printErr+'\n==================================================================\n');
				var bufferPosition = 0,
		        bufferLength = writeBuffer.length,
		        filePosition = null;
				fs.write(fd, writeBuffer, bufferPosition, bufferLength, filePosition, function(err, written){
					console.log("file written.");
				})
			})
		// console.log("inside err logError function", err);
		res.header("Content-Type:","application/json");
        res.send({'ErrorMsg' : 'Something went wrong, Found Error'});
	};
	this.logErrorFileUpload = function(err){
		var errorTime = this.formatAMPM(new Date());
		var printErr = errorTime+err.stack;
		var today = this.filename() + '.log';		
			fs.open('./logs/log/'+today,'a', function(err, fd){
				var writeBuffer = new Buffer (printErr+'\n==================================================================\n');
				var bufferPosition = 0,
		        bufferLength = writeBuffer.length,
		        filePosition = null;
				fs.write(fd, writeBuffer, bufferPosition, bufferLength, filePosition, function(err, written){
					console.log("file written.");
				})
			})
	};
};

module.exports = function(){
	var obj = new logObj();
	return obj;
}