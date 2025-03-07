import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from './contexts/ThemeContext'; 
import { createAdminIfNone } from './services/DataService';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'; // Import ErrorBoundary component

// Components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Wallet from "./components/Wallet/Wallet";
import Products from "./components/Products/Products";
import History from "./components/History/History";
import Reports from "./components/Reports/Reports";
import AdminPanel from "./components/Admin/AdminPanel";
import Navbar from "./components/Layout/Navbar";
import ProfileSettings from "./components/Profile/ProfileSettings";
import Cart from "./components/Cart/Cart"; 
import Home from './components/Home/Home'; 


function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Ensure we have an admin account (will be created if none exists)
    createAdminIfNone();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);


  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  return (
    <>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/wallet" element={user ? <Wallet user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/products" element={user ? <Products user={user} /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <Cart user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/history" element={user ? <History user={user} /> : <Navigate to="/login" />} />
        <Route path="/reports" element={user ? <Reports user={user} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user && user.isAdmin ? <AdminPanel /> : <Navigate to="/dashboard" />} />
        <Route path="/profile" element={user ? <ProfileSettings user={user} onUpdateUser={handleUserUpdate} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Home />} /> 
        <Route path="/home" element={<Home />} /> 

      </Routes>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary showDetails={false}>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;