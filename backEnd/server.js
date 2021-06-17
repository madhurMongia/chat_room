const server = require('http').createServer()
const {instrument} = require('@socket.io/admin-ui')
require("dotenv").config()
const io = require("socket.io")(server, {
    cors:{
        origin: ["https://admin.socket.io","http://localhost:3000"],
        credentials:true
    },
    transports:["websocket","polling"]
})

io.on('connection', socket => {
    console.log(socket.id)
    socket.on('send-message',(str,room)=>{
        if(!room){
            socket.broadcast.emit('recieve-msg',str)
        }else{
            socket.to(room).emit('recieve-msg',str)
        }
        console.log(str)
    })
    socket.on("join-room", (room,cb)=>{
        socket.join(room)
        cb(`Joined ${room}`)
    })

    socket.on('disconnect',(num) =>{
        console.log(socket.id + " disconnected")
    })
})

io.on("disconnect",(socket)=>{
    console.log(socket.id + " disconnected")
})

instrument( io,{auth:false})

server.listen(process.env.PORT || 5000)
