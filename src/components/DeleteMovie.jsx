import { useNavigate } from 'react-router-dom';
import { Button, Popconfirm, message } from 'antd';
import api from '../api/api';

export default function DeleteMovie({ token, movieId }) {
   const navigate = useNavigate();

   const handleDelete = async () => {
      try {
         await api.delete(`/movies/${movieId}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         message.success('Movie deleted successfully');
         navigate('/');
      } catch (err) {
         console.error('Error deleting movie:', err);
         message.error('Failed to delete movie');
      }
   };

   return (
      <Popconfirm
         title='Are you sure you want to delete this movie?'
         onConfirm={handleDelete}
         okText='Yes'
         cancelText='No'
      >
         <Button danger type='default'>
            Delete Movie
         </Button>
      </Popconfirm>
   );
}
