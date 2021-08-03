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
io.sockets.on('connection', function(socket) {
    socket.on('emit_from_client', function(data) {
    // ここから修正箇所
    socket.client_name = data.name; 
    io.sockets.emit('emit_from_server', '[' + socket.client_name + '] : ' + data.msg);
    // 修正箇所ここまで
        
    });
});

