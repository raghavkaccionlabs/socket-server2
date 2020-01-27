var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
})

app.post('/add_device', function (req, res) {
   // First read existing users.
   //READ Request Handlers
   let chip_id = req.body.chip_id;
   let pin_num = req.body.pin_num;
   let pin_status = req.body.pin_status;
   if(!chip_id){
       return res.status(400).send({
//         success: 'false',
         message: 'id field is required',
       });
   }
   if(!pin_num){
       return res.status(400).send({
//         success: 'false',
         message: 'pin_num field is required',
       });
   }
   if(!pin_status){
       return res.status(400).send({
//         success: 'false',
         message: 'pin_status field is required',
       });
   }

   console.log('user id '+chip_id);
   console.log('user pin_num '+pin_num);
   console.log('user pin_status '+pin_status);

   const data = {
     chip_id: chip_id,
     pin_num: pin_num,
     pin_status: pin_status
   }

   io.sockets.emit('message', data);
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