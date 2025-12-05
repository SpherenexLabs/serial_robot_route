import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import MediaLibrary from './pages/MediaLibrary';
import Playlists from './pages/Playlists';
import Login from './components/Login';
// Devices - Commented out for now, will implement later
// import Devices from './pages/Devices';
import { useInitializeFirebase } from './hooks/useInitializeFirebase';
import { useFirebaseStatus } from './hooks/useFirebaseStatus';
import FirebaseStatus from './components/FirebaseStatus';
import PlaylistPlayer from './components/PlaylistPlayer';
import './App.css';

function App() {
  // Initialize Firebase database on first load
  useInitializeFirebase();
  
  // Check Firebase connection and permissions
  const firebaseStatus = useFirebaseStatus();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in (from sessionStorage)
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isLoggedIn');
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <FirebaseStatus status={firebaseStatus} />
      <PlaylistPlayer />
      <Routes>
        <Route path="/" element={<DashboardLayout onLogout={handleLogout} />}>
          <Route index element={<Dashboard />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="playlists" element={<Playlists />} />
          {/* Devices - Commented out for now, will implement later */}
          {/* <Route path="devices" element={<Devices />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
