import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage"

export default function App() {

  return (
    <>
    <div>
     <Router>
      <AuthProvider>
      <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/auth' element={<AuthPage />} />
      </Routes>
      </AuthProvider>
     </Router>
    </div>
    </>
  )
}
