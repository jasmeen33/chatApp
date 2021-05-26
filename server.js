const mongoose = require('mongoose')
const express = require('express'), http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server,{cors: {
    origin: '*',
  }});


const port = 8000
const url = 'mongodb://127.0.0.1:27017/chatapplication';
let connectedUsers=[];
let usersConnected = {}

//set application to accept the form data
// app.use(express.urlencoded({extended:false}))
app.use(express.json())

//connection with the mongodb server
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    console.log("connecting succesfully...")
}).catch((err) => console.log(err))

const routerInit = require('./app/router/web')
routerInit(app);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect',()=>{
        console.log("a user disconnected");
        connectedUsers = connectedUsers.filter(
            (item)=>{
                item.socketId != socket.id;
            }
        );
        Object.keys(usersConnected).forEach(key => {
            if (usersConnected[key] == socket.id) delete usersConnected[key];
        })
        io.emit('updateUserList',connectedUsers);
    });
    socket.on('loggedin',(user)=>{
        connectedUsers.push({...user});
        usersConnected[user._id] = socket.id.toString();
	
        // console.log(connectedUsers);
        // let users = connectedUsers.filter(
        //     item =>{
        //         item._id != user._id
        //     }
        // )
        io.emit('updateUserList',connectedUsers);
    })
    socket.on('chatMessage', function(data){
        console.log(data.receiver)
        // user = connectedUsers.filter(
        //     (item)=>{
        //         if(item._id == data.receiver){
        //             console.log(item.socketId);
        //             socket.to(item.socketId).emit('message', data);
        //             console.log(data.message)
        //         }
        //     }
        // );
        socket.to(usersConnected[data.receiver]).emit('message', data);
     });
    
  });



server.listen(port, () => {
    console.log(`app running on the port: ${port}`)
})


