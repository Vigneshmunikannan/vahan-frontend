import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../PrivateComponents/Header";
import AllStudents from "../PrivateComponents/AllStudents";
import AddStudent from "../PrivateComponents/AddStudent"
import MyProfile from "../PrivateComponents/Myprofile"
import { useAuth } from './Context';
import Error from "../PrivateComponents/Error"
const PrivateRoute = () => {
  const { isValidTokenAvailable } = useAuth();
  return (
    <>
      {isValidTokenAvailable() && <Header />}
      <Routes>
        {
          isValidTokenAvailable() && <>
            <Route path="/students" element={<AllStudents />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="*" element={<Error />} />
          </>
        }
        
      </Routes>
    </>
  );
};

export default PrivateRoute;
