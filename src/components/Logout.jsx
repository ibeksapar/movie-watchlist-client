import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export default function Logout({ setToken }) {
   const navigate = useNavigate();

   const handleLogout = () => {
      localStorage.removeItem('token');
      setToken(null);
      navigate('/login', { replace: true });
   };

   return (
      <Button type='default' onClick={handleLogout}>
         Logout
      </Button>
   );
}
