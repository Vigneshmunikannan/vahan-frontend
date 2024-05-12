import React,{useEffect} from 'react';
import { useAuth } from "../routes/Context";
import { useNavigate } from 'react-router-dom';

export default function AddStudent() {
  const { isValidTokenAvailable } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isValidTokenAvailable()) {
      navigate('/', { replace: true });
    }
  }, []);

  return (
    <div>
   add student
    </div>
  );
}
