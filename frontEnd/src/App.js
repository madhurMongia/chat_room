
import { useEffect,useRef, useState } from 'react';
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000",{
  transports:["websocket","polling"]
})
const userIo = io.connect("http://localhost:5000/user",{auth : {token : "userToken"},transports:["websocket","polling"]})

function App() {

  const [messages,setMessages] = useState([])
  const msgRef = useRef()
  const roomRef = useRef()

  function displayMessage(msg){
    setMessages([...messages,msg])
  }

  function sendMessage(){
    if(!msgRef.current.value) return

    displayMessage(msgRef.current.value)
    socket.emit("send-message", msgRef.current.value,roomRef.current.value)
    msgRef.current.value = ""
  }
  function joinRoom(){
    if(!roomRef.current.value) return
    socket.emit("join-room", roomRef.current.value,(msg) =>{
      displayMessage(msg)
    })
    roomRef.current.value = ""
  }
  useEffect(
		() => {
      socket.on('connect', () => {
        displayMessage(socket.id)
    })
    return () => {socket.disconnect()}
  },[])


  socket.on("recieve-msg",(message)=>{
    displayMessage(message)
  })

  return (<div style = {{
    display:"flex",
    justifyContent:"center",
    flexDirection:"column",
    alignItems:"center",
    fontFamily:"monospace",

  }}>
    <div style = {{
      height: "300px",
      width: "400px",
      border: "2px solid black",
      borderRadius:"2px",
      marginBottom:"10px",
      overflow:"scroll"
    }}>
    <ul style = {{
      textDecoration:"none",
      listStyle:"none",
      paddingLeft:"0px"
    }}>
      {messages.map((msg,index) => {
        return <li style = {{
          padding:"10px",
          backgroundColor: index%2===0? "grey": "white"
        }} key = {index}>{msg} <i class="fas fa-trash-alt" style = {{float: "right"}}></i></li>
      })}</ul>  
    </div>
    <div style = {{
      display: "flex",
      flexDirection:"row",
      gap:"8px",
      marginBottom:"15px",
      justifyContent:"center"
    }}>
    <label for = "msg">Message</label>
    <input type = "text" id = "msg" ref = {msgRef}/><button onClick = {sendMessage} style = {{
      fontSize:"15px",
      width:"50px"
    }}>Send</button>
    </div>
    <div style = {{
      display: "flex",
      flexDirection:"row",
      gap:"8px",
      justifyContent:"center",
      marginLeft:"22px"
    }}>
    <label for = "room">Room</label>
    <input type = "text" id = "room" ref = {roomRef}/><button  onClick = {joinRoom}  style = {{
      fontSize:"15px",
      width:"50px",
    }}>Join</button>
    </div>
  </div>
  )
  }
export default App;
