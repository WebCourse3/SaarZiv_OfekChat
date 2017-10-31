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

io.on('connection', function(socket){
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	socket.on('chat message',function (msg) {

		switch(true){
			case new RegExp("\setColor .+").test(msg):
				var dividedColor = msg.split(" ");
				var color = dividedColor[dividedColor.length -1]
				socket.emit("set color",color);
				break;
			case new RegExp("\setBold").test(msg):
				socket.emit("set Bold");
				break;
			case new RegExp("\setitalic").test(msg):
				socket.emit("set italic");
				break;
			default:
				socket.broadcast.emit("chat message",msg);
				break;

		}
	})
});


http.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})
