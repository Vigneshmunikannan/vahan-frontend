import React, { useEffect, useState } from 'react';
import { useAuth } from "../routes/Context";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageComponent from '../Response/Message';
export default function MyProfile() {
  const { isValidTokenAvailable, accessToken, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isValidTokenAvailable()) {
      navigate('/', { replace: true });
    }
  }, []);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const handleLogout = () => {
    logout();
  };

  const errorHandler=(error)=>{
    if (error.response.status === 401 || error.response.status === 403) {
      setErrorMessage('Session Expired');
      setTimeout(() => {
        setErrorMessage('')
        logout();
      }, 2000);
    }
    else {
      setErrorMessage(error.response.data.message);
      setTimeout(() => {
        setErrorMessage('')
      }, 2000);
    }
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/myprofile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setUserData(response.data.user);
      } catch (error) {
        errorHandler(error)
      }
    };

    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);


  return (
    <div>
      <div className="profile-container">
        <div>
          {successMessage && <MessageComponent type="success" message={successMessage} />}
          {errorMessage && <MessageComponent type="error" message={errorMessage} />}
          <div className='profile-container1'>
            <h2>My Profile</h2>
            {userData && (
              <div className="user-details">
                <p><strong>Username:</strong> {userData.username}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Name:</strong> {userData.name}</p>
              </div>
            )}
            <button onClick={handleLogout} className="nav__button">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
