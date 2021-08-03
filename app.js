const { isContext } = require('vm');

var app = require('http').createServer(handler),
    io = require('socket.io')(app),
    fs = require('fs');
app.listen(1337);
function handler(req, res) {
    fs.readFile(__dirname + '/index.html', function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error');
        }
        res.writeHead(200);
        res.write(data);
        res.end();
    })
    
}

var member = [];
var myname = "";


io.sockets.on('connection', function(socket) {

    //　ブラウザ起動時に
    socket.emit('emit_from_server_onload', member);


    //　チャット
    socket.on('emit_from_client', function(data) {
    socket.client_name = data.name; 
    io.sockets.emit('emit_from_server', '[' + socket.client_name + '] : ' + data.msg);
    });

    //　参加フォーム
    socket.on('emit_from_client_join', function(data) {
      myname = data.nickname;

      socket.client_nickname = data.nickname; 
      io.sockets.emit('emit_from_server_join', socket.client_nickname);
      socket.emit('emit_from_server_join_me', socket.client_nickname);
      member.push(data.nickname);
    });

    // ブラウザ終了時
    socket.on('disconnect', () =>
    {
      var idx = member.indexOf(myname);
      if(idx >= 0){
      member.splice(idx, 1); 
      }
      
      io.sockets.emit('emit_from_server_disconnect', member);
    });
});

