
import { useState, useEffect } from 'react';
import { updateUserProfile, updateUserPassword, getUserById } from '../../services/DataService';

const ProfileSettings = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      setMessage({ text: 'Full name is required', type: 'danger' });
      return;
    }
    
    try {
      const updatedUser = updateUserProfile(user.id, {
        fullName: formData.fullName,
        preferences: formData.preferences
      });
      
      if (updatedUser) {
        onUpdateUser(updatedUser);
        setMessage({ text: 'Profile updated successfully', type: 'success' });
      } else {
        setMessage({ text: 'Failed to update profile', type: 'danger' });
      }
    } catch (error) {
      setMessage({ text: 'Error updating profile: ' + error.message, type: 'danger' });
    }
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validate password
    if (!formData.currentPassword) {
      setMessage({ text: 'Current password is required', type: 'danger' });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setMessage({ text: 'New password must be at least 6 characters', type: 'danger' });
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'danger' });
      return;
    }
    
    try {
      const success = updateUserPassword(
        user.id, 
        formData.currentPassword, 
        formData.newPassword
      );
      
      if (success) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setMessage({ text: 'Password updated successfully', type: 'success' });
      } else {
        setMessage({ text: 'Current password is incorrect', type: 'danger' });
      }
    } catch (error) {
      setMessage({ text: 'Error updating password: ' + error.message, type: 'danger' });
    }
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  return (
    <div className="container">
      <h1>Profile Settings</h1>
      
      <ul className="nav-tabs">
        <li>
          <a 
            href="#" 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </a>
        </li>
        <li>
          <a 
            href="#" 
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </a>
        </li>
      </ul>
      
      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}
      
      {activeTab === 'profile' && (
        <div className="card">
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
              <small>Email cannot be changed</small>
            </div>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      )}
      
      {activeTab === 'password' && (
        <div className="card">
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="form-control"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="form-control"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
