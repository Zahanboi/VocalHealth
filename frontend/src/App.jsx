import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/landingPage";
// import Authentication from './pages/authPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
     <Router>
      <AuthProvider>
      <Routes>
            <Route path='/' element={<LandingPage />} />
            {/* <Route path='/auth' element={<Authentication />} /> */}
      </Routes>
      </AuthProvider>
     </Router>
    </div>
    </>
  )
}

export default App
