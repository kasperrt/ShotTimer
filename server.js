var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  var socketid = socket.id.substring(2);
  var guid = uniqueID(socketid, 4);

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

function uniqueID(seed, minlen){
    var len = minlen;
    var id = rndName(seed, minlen);

    while( contains(unique_ids, id) && len<=8){
        id = rndName(String(len)+id, len);
        len += 0.1;                        // try 10 times at each length
    }
    return id;
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
