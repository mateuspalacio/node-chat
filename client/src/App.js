import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import React, {useState} from 'react'
import {UserContext} from './UserContext'
import Chat from './components/chat/Chat'
import Home from './components/home/Home'
import Navbar from './components/layout/Navbar';

function App() {
  const [user, setUser] = useState(null)
  return (
    <Router>
    <div className="App">
     <UserContext.Provider value={{user, setUser}}>
       <Navbar />
       <Routes> {/* used to be Switch instead of Routes (before v6.0) */}
          <Route exact path="/" element={<Home />}/>  {/* used to be component instead of element (before v6.0) */}
          <Route path="/chat/:room_id/:room_name" element={<Chat />}/>
       </Routes>

     </UserContext.Provider>
    </div>
    </Router>

  );
}

export default App;
