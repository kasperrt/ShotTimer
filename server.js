var server;
var app = require('express')();
var add = "";

try{
    var fs = require('fs');
    //var privateKey  = fs.readFileSync('/home/kasper/newssl_2016/nopass.key', 'utf8');
    //var certificate = fs.readFileSync('/home/kasper/newssl_2016/zoff.no/ApacheServer/2_zoff.no.crt', 'utf8');
    //var ca          = fs.readFileSync('/home/kasper/newssl_2016/zoff.no/ApacheServer/1_root_bundle.crt');
    var privateKey  = fs.readFileSync('/etc/letsencrypt/live/etys.no-0001/privkey.pem').toString();
    var certificate = fs.readFileSync('/etc/letsencrypt/live/etys.no-0001/cert.pem').toString();
    var ca          = fs.readFileSync('/etc/letsencrypt/live/etys.no-0001/chain.pem').toString();

    //var ca_bundle   = fs.readFileSync('/home/kasper/startssl/ca-bundle.pem')
    //var credentials = {key: privateKey, cert: certificate, ca: ca,};
    var credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };

    var https = require('https');
    server = https.createServer(credentials, app);
}
catch(err){
    console.log("Starting without https (probably on localhost)");
    var http = require('http');
    server = http.createServer(app);
}

var io = require('socket.io')(server);
var crypto = require('crypto');
var unique_ids = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  var socketid = socket.id.substring(2);
  var guid = uniqueID(socketid, 4);
  unique_ids.push(guid);
  socket.on("join", function(obj){
    io.to(obj.id).emit("joined", {_name: obj.name, _drawing: obj.drawing});
  });

  socket.on("host", function(){
    socket.join(guid);
    socket.emit("id", guid);
  });

  socket.on('disconnect', function()
    {
        left(guid);
    });

    socket.on('reconnect_failed', function()
    {
        left(guid);
    });

    socket.on('connect_timeout', function()
    {
        left(guid);
    });

    socket.on('error', function()
    {
        left(guid);
    });

});

function left(element){
  if(contains(unique_ids, element)){
        var index = unique_ids.indexOf(element);
        if(index != -1)
            unique_ids.splice(index, 1);
    }
}

function hash_pass(thing)
{
    return crypto.createHash('sha256').update(thing).digest('base64');
}

function rndName(seed, len) {
    var vowels = ['a', 'e', 'i', 'o', 'u'];
    consts =  ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'y'];
    //len = 8;
    len = Math.floor(len);
    word = '';
    is_vowel = false;
    var arr;
    for (var i = 0; i < len; i++) {
        if (is_vowel) arr = vowels;
        else arr = consts;
        is_vowel = !is_vowel;
        word += arr[(seed[i%seed.length].charCodeAt()+i) % (arr.length-1)];
    }
    return word;
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

function contains(a, obj) {
    try{
        var i = a.length;
        while (i--) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }catch(e){
        return false;
    }
}

server.listen(3000, function(){
  console.log('listening on *:3000');
});
