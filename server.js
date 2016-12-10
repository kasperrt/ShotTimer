var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  var guid = hash_pass(socket.handshake.headers["user-agent"] + socket.handshake.address + socket.handshake.headers["accept-language"]);

  socket.on("join", function(obj){
    io.to(obj.id).emit("joined", {_name: obj.name});
  });

  socket.on("host", function(){
    socket.join(guid);
    socket.emit("id", guid);
  });

});

function hash_pass(thing)
{
    return crypto.createHash('sha256').update(thing).digest('base64');
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
