const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes')
app.use(express.json()) // used to process incoming requests as json for posts
app.use(authRoutes)
const http = require('http');
const mongoose = require('mongoose')
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const mongodb = "mongodb+srv://ckmobile:ckmobile123@cluster0.25dej.mongodb.net/chat-database?retryWrites=true&w=majority"
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log('connected')).catch(err => console.log(err))

const {addUser, getUser, removeUser} = require('./helper');
const Message = require('./models/Message');
const PORT = process.env.PORT || 5000
const Room = require('./models/Room')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log(socket.id);
  Room.find().then(result => {
      socket.emit('output-rooms', result)
  })
  socket.on('create-room', name=>{
    //   console.log('the room name is ', name)
    const room = new Room({name})
    room.save().then(result => {
        io.emit('room-created', result)
    })
  })
  socket.on('join', ({name, room_id, user_id}) =>{
      const {error, user} = addUser({
          socket_id: socket.id,
          name,
          room_id,
          user_id
      })
      socket.join(room_id)
      if (error) {
          console.log('join error', error)
      } else {
          console.log('join user', user)
      }
  })
  socket.on('sendMessage', (message,room_id,callback)=> {
      const user = getUser(socket.id)
      const msgToStore = {
          name: user.name,
          user_id: user.user_id,
          room_id,
          text: message
      }
      console.log('messae', msgToStore)
      const msg = new Message(msgToStore)
      msg.save().then(result => {
        io.to(room_id).emit('message', msgToStore)
        callback()
      })
  })
  socket.on('disconnect', ()=>{
      const user = removeUser(socket.id)
  })
});

server.listen(PORT, () => {
  console.log(`'listening on *: ${PORT}'`);
});