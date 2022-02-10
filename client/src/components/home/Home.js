import React, {useContext, useState, useEffect} from 'react'
import { UserContext } from '../../UserContext'
import {Link} from 'react-router-dom'
import RoomList from './RoomList'
import io from 'socket.io-client'
let socket

const Home = () => {
    const ENDPT = 'localhost:5000'
    
    const {user, setUser} = useContext(UserContext)
    const [room,setRoom] = useState('')
    const [rooms, setRooms] = useState([])
    useEffect(() => {
      socket = io(ENDPT)
    
      return () => {
        socket.emit('disconnect')
        socket.off()
      }
    }, [ENDPT])
    useEffect(() => {
      socket.on('output-rooms', rooms => {
        setRooms(rooms)
      })
    }, []) // this will watch for updates on the thing, but since this is just for initial load we won't update it, that is for the next methods
    
    useEffect(() => {
      socket.on('room-created', room => {
        setRooms([...rooms, room])
      })
    }, [rooms])
    useEffect(() => {
      console.log(rooms)
    }, [rooms])
    
    const handleSubmit = e=>{
        e.preventDefault()
        socket.emit('create-room', room)
        console.log(room)
        setRoom('')
    }
    const setAsJohn = ()=>{
        const john = {
            name:'John',
            email: 'john@email.com',
            password: '123',
            id: '123'
        }
        setUser(john)
    }
    const setAsTom = ()=>{
        const tom = {
            name:'Tom',
            email: 'tom@email.com',
            password: '456',
            id: '456'
        }
        setUser(tom)
    }
  return (
    <div>
       <div className="row">
  <div className="col s12 m6">
    <div className="card blue-grey darken-1">
      <div className="card-content white-text">
        <span className="card-title">Welcome {user? user.name : ''}</span>
        <div className="row">
    <form className="col s12" onSubmit={handleSubmit}>
  <div className="row">
    <div className="input-field col s12">
      <input placeholder="Room name" id="room" type="text" className="validate" value={room} onChange={e => setRoom(e.target.value)} />
      <label htmlFor="room">Room</label>
    </div>
  </div>
  <button className='btn'>Create Room</button>
</form>

  </div>
      </div>
      <div className="card-action">
        <a href="#" onClick={setAsJohn}>set as John</a>
        <a href="#" onClick={setAsTom}>set as Tom</a>
      </div>
    </div>
  </div>
  <div className='col s6 m5 offset-1'>
    <RoomList rooms={rooms}/>
  </div>
</div>
<Link to={'/chat'}>
            <button className='btn'>go to chat</button>
        </Link>
    </div>
  )
}

export default Home