import React, { useEffect, useState } from 'react';
import { useAuth } from "../routes/Context";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageComponent from '../Response/Message';
export default function AddStudent() {
  const { isValidTokenAvailable, accessToken, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    DOB: '',
    mobileNumber: '',
    department: '',
    lastname: '',
    college: '',
    year: '',
    firstname: '',
    rollnumber: ''
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (!isValidTokenAvailable()) {
      navigate('/', { replace: true });
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.DOB || !formData.mobileNumber || !formData.department || !formData.lastname || !formData.firstname || !formData.college || !formData.year || !formData.rollnumber) {
      setErrorMessage('All fields are mandatory');
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return;
    }
    try {
      if (isLoading) return; // Prevent multiple requests
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/add-student`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      // console.log(response.data);
      setIsLoading(false);
      // console.log(response.data)
      setSuccessMessage(response.data.message)
      setTimeout(() => {
        setSuccessMessage('')
        setFormData({
          DOB: '',
          mobileNumber: '',
          department: '',
          lastname: '',
          college: '',
          year: '',
          firstname: '',
          rollnumber: ''
        })

      }, 2000);
    } catch (error) {
      // console.log('Error adding student:', error.response);
      setIsLoading(false);
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
  }

  return (
    <div className="form-container"> {/* Add class name to container */}
      {successMessage && <MessageComponent type="success" message={successMessage} />}
      {errorMessage && <MessageComponent type="error" message={errorMessage} />}
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        {/* Roll no */}
        <div className="form-group">
          <label htmlFor="rollnumber">Roll Number:</label>
          <input type="text" id="rollnumber" name="rollnumber" className="form-input" value={formData.rollnumber} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">First Name:</label>
          <input type="text" id="firstname" name="firstname" className="form-input" value={formData.firstname} onChange={handleInputChange} />
        </div>
        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="lastname">Last Name:</label>
          <input type="text" id="lastname" name="lastname" className="form-input" value={formData.lastname} onChange={handleInputChange} />
        </div>
        {/* Date of Birth */}
        <div className="form-group">
          <label htmlFor="DOB">Date of Birth:</label>
          <input type="date" id="DOB" name="DOB" className="form-input" value={formData.DOB} onChange={handleInputChange} />
        </div>
        {/* Mobile Number */}
        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input type="text" id="mobileNumber" name="mobileNumber" className="form-input" value={formData.mobileNumber} onChange={handleInputChange} />
        </div>
        {/* Department */}
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select id="department" name="department" className="form-input" value={formData.department} onChange={handleInputChange}>
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="CSBS">CSBS</option>
            <option value="AIDS">AIDS</option>
            <option value="EEE">EEE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
            <option value="CVIL">CVIL</option>
            <option value="AIML">AIML</option>
          </select>

        </div>
        {/* College */}
        <div className="form-group">
          <label htmlFor="college">College:</label>
          <input type="text" id="college" name="college" className="form-input" value={formData.college} onChange={handleInputChange} />
        </div>
        {/* Year */}
        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <select id="year" name="year" className="form-input" value={formData.year} onChange={handleInputChange}>
            <option value="">Select Year</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        {/* Submit button */}
        <button type="submit" className="form-submit">Submit</button>
      </form>
    </div>
  )
}
