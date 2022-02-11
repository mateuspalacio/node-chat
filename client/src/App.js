import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import React, {useState, useEffect} from 'react'
import {UserContext} from './UserContext'
import Chat from './components/chat/Chat'
import Home from './components/home/Home'
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/verifyuser', {
        credentials: 'include',
        headers: {'Content-Type':'application/json'}
        })
        const data = await res.json()
        setUser(data)
      } catch (error) {
        console.log(error)
      }
      
    }
    verifyUser()
  }, [])
  
  return (
    <Router>
    <div className="App">
     <UserContext.Provider value={{user, setUser}}>
       <Navbar />
       <Routes> {/* used to be Switch instead of Routes (before v6.0) */}
          <Route exact path="/" element={<Home />}/>  {/* used to be component instead of element (before v6.0) */}
          <Route path="/signup" element={<Signup />}/>  {/* used to be component instead of element (before v6.0) */}
          <Route path="/login" element={<Login />}/>  {/* used to be component instead of element (before v6.0) */}
          <Route path="/chat/:room_id/:room_name" element={<Chat />}/>
       </Routes>

     </UserContext.Provider>
    </div>
    </Router>

  );
}

export default App;
