var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
})

app.post('/add_device', function (req, res) {
   // First read existing users.
   //READ Request Handlers
   res.send('Device added successfully.');
})

io.on('connection',function(socket){
    console.log('one user connected '+socket.id);
    socket.on('message',function(data){
        var sockets = io.sockets.sockets;
        /*sockets.forEach(function(sock){
            if(sock.id != socket.id)
            {
                sock.emit('message',data);
            }
        })*/
        socket.broadcast.emit('message', data);
        console.log('message '+data);
    })
    socket.on('disconnect',function(){
        console.log('one user disconnected '+socket.id);
    })
})

http.listen(3200,function(){
    console.log('server listening on port 3200');
})