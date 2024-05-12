import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../PrivateComponents/Header";
import AllStudents from "../PrivateComponents/AllStudents";
import AddStudent from "../PrivateComponents/AddStudent"
import MyProfile from "../PrivateComponents/Myprofile"
import { useAuth } from './Context';

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
          </>
        }
      </Routes>
    </>
  );
};

export default PrivateRoute;
