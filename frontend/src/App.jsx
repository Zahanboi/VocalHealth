import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import HealthCheck from "./components/HealthCheck";
import Dashboard from './pages/Dashboard';
import ExercisesPage from './pages/Exercises';
export default function App() {


  return (
    <>
    <div>
     <Router>
      <AuthProvider>
      <Routes>

            <Route path='/' element={<LandingPage />} />
            <Route path='/auth' element={<AuthPage />} />

             <Route element={<ProtectedRoute />}>
              <Route path="/health" element={<HealthCheck />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/exercises" element={<ExercisesPage />} />
             </Route>

      </Routes>
      </AuthProvider>
     </Router>
    </div>
    </>
  )
  
}
