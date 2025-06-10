import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Navigate - ???
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import EventCreate from './pages/EventCreate';
import Donations from './pages/Donations';
import DonationDetails from './pages/DonationDetails';
import DonationCreate from './pages/DonationCreate';
// import Messages from './pages/Messages';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/events/:eventId" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
        <Route path="/events/create" element={<ProtectedRoute><EventCreate /></ProtectedRoute>} />

        <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
        <Route path="/donations/:donationId" element={<ProtectedRoute><DonationDetails /></ProtectedRoute>} />
        <Route path="/donations/create" element={<ProtectedRoute><DonationCreate /></ProtectedRoute>} />
        {/* <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} /> */}
      </Routes>
    </Router>
  );
};


export default App
