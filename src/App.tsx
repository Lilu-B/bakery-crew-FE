import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Events from './pages/Events';
import Donations from './pages/Donations';
import Messages from './pages/Messages';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Защищённые страницы */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

        {/* Защищённые страницы 
          
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/messages" element={<Messages />} />
        </Route>
          
          import { Navigate, Outlet } from 'react-router-dom';

        const ProtectedRoute = () => {
          const isAuthenticated = / логика проверки токена /;
          return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
        */};

export default App
