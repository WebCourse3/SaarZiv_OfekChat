const express = require('express')
const app = express();
app.use(express.static('C:\\Users\\Jbt\\WebstormProjects\\SaarZiv_OfekChat\\public'))

var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function (req, res) {
	res.send('Hello World! !!!')
});
app.get('/Chat', function (req, res) {
	res.sendfile("C:\\Users\\Jbt\\WebstormProjects\\SaarZiv_OfekChat\\public\\Html\\Chat.html")
});
io.emit('chat message', { for: 'everyone' });

var appUserId = 0;
var userClass = function (){
	this.userId = 0;
	this.color = "";
	this.fontWeight = "";
	this.fontStyle = "";
};

io.on('connection', function(socket){
	var userInstance = new userClass();
	appUserId ++;
	userInstance.userId = appUserId;

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	socket.on('chat message',function (msg) {
		var dividedColor = msg.split(" ");
		switch(true){

			case new RegExp("\setColor .+").test(msg):
				userInstance.color =dividedColor[dividedColor.length -1];
				break;

			case new RegExp("\setBold").test(msg):
				userInstance.fontWeight = "Bold";
				break;

			case new RegExp("\setitalic").test(msg):
				userInstance.fontStyle = "italic";
				break;

				/*Extra Functions , changes previous messages according to user.
				* didnt finish them yet.*/
			case new RegExp("\setPColor +.").test(msg):
				var Pcolor = dividedColor[dividedColor.length -1];
				socket.broadcast.emit("set Previous msg color",Pcolor,userInstance.userId);
				break;
			case new RegExp("\setPBold"):
				socket.broadcast.emit("set Previous msg to Bold",userInstance.userId);
				break;
			case new RegExp("\setPitalic"):
				socket.broadcast.emit("set Previous msg to italic",userInstance.userId);
				break;
			default:
				socket.broadcast.emit('append chat message',msg,userInstance.color,userInstance.fontWeight,userInstance.fontStyle,userInstance.userId);
				break;

		}
	});


});


http.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})
