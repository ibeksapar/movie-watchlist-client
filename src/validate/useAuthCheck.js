import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../api/auth';

function useAuthCheck(setToken) {
   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) return;

      auth
         .get('/validate', { headers: { Authorization: `Bearer ${token}` } })
         .then((res) => {})
         .catch(() => {
            localStorage.removeItem('token');
            setToken(null);
            navigate('/login', { replace: true });
         });
   }, [setToken, navigate]);
}

export default useAuthCheck;
