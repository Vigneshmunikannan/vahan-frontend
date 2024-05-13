import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../routes/Context";
import { useNavigate } from 'react-router-dom';
import MessageComponent from '../Response/Message';

export default function AllStudents() {
  const { isValidTokenAvailable, accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [editedData, setEditedData] = useState({
    department: '',
    year: '',
    mobileNumber: '',
    college: '',
    DOB: ''
  });

  useEffect(() => {
    if (!isValidTokenAvailable()) {
      navigate('/', { replace: true });
    } else {
      fetchStudents();
    }
  }, []);

  const errorHandler = (error) => {
    setIsLoading(false);
    if (error.response.status === 401 || error.response.status === 403) {
      setErrorMessage(error.response.data.message);
      setTimeout(() => {
        setErrorMessage('');
        logout();
      }, 2000);
    } else {
      setErrorMessage(error.response.data.message);
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getallstudents`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setStudents(response.data.students);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleDelete = async (id) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      setIsLoading(false);
      setSuccessMessage(response.data.message);
      fetchStudents();
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setEditedData({
      department: student.department,
      year: student.year,
      mobileNumber: student.mobileNumber,
      college: student.college,
      DOB: student.DOB
    });
  };


  const handleSaveEdit = async (e) => {
    e.preventDefault();
    // Compare edited data with original data
    const hasChanges = Object.keys(editedData).some(key => editedData[key] !== selectedStudent[key]);

    if (!hasChanges) {
      setErrorMessage('No change in data');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      handleCloseEdit();
      return;
    }
    const changedData = {};
    Object.keys(editedData).forEach(key => {
      if (editedData[key] !== selectedStudent[key]) {
        changedData[key] = editedData[key];
      }
    });

    try {
      if (isLoading) return;
      setIsLoading(true);
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/update/${selectedStudent.id}`, changedData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      setIsLoading(false);
      setSuccessMessage(response.data.message);
      fetchStudents();
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
      handleCloseEdit();
    } catch (error) {
      errorHandler(error);
    }
  };




  const handleCloseEdit = () => {
    setEditedData({
      department: '',
      year: '',
      mobileNumber: '',
      college: '',
      DOB: ''
    });
    setSelectedStudent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return ''; // Return empty string if date is not provided
    const dateObject = new Date(dateString);
    // Format the date as "YYYY-MM-DD"
    const formattedDate = dateObject.toISOString().split('T')[0];
    return formattedDate;
  };


  return (
    <div className='container'>
      <h1>All Students</h1>
      {successMessage && <MessageComponent type="success" message={successMessage} />}
      {errorMessage && <MessageComponent type="error" message={errorMessage} />}
      <ul>
        {students.length > 0 ? (
          students.map(student => (
            <li key={student.id}>
              <div>
                <p>Name: {student.firstname} {student.lastname}</p>
                <p>Roll Number: {student.rollnumber}</p>
                <p>Department: {student.department}</p>
                <p>Year: {student.year}</p>
                <p>Mobile Number: {student.mobileNumber}</p>
                <p>DOB : {new Date(student.DOB).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <p>College: {student.college}</p>
              </div>
              <div>
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button onClick={() => handleDelete(student.id)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <div>No Student Found</div>
        )}
      </ul>
      {selectedStudent && (
        <div className="edit-popup">
          <div className="popup-content">
            <h2>Edit Student Details</h2>
            <form onSubmit={handleSaveEdit}>
              <label>Department:</label>
              <select id="department" name="department" value={editedData.department} onChange={handleInputChange}>
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
              <label>Year:</label>
              <select name="year" value={editedData.year} onChange={handleInputChange}>
                {[1, 2, 3, 4].map((yearValue) => (
                  <option key={yearValue} value={yearValue}>
                    {yearValue}
                  </option>
                ))}
              </select>

              <label>Mobile Number:</label>
              <input type="text" name="mobileNumber" value={editedData.mobileNumber} onChange={handleInputChange} />
              <label>College:</label>
              <input type="text" name="college" value={editedData.college} onChange={handleInputChange} />
              <label>DOB:</label>
              <input
                type="date"
                name="DOB"
                value={formatDateForInput(editedData.DOB)}
                onChange={handleInputChange}
              />
              <button type="submit">Save</button>
              <button onClick={handleCloseEdit}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
