import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
   Card,
   Typography,
   Button,
   List,
   Divider,
   Form,
   Input,
   InputNumber,
   message,
   Space,
   Spin,
} from 'antd';
import { StarOutlined, CommentOutlined, EditOutlined } from '@ant-design/icons';
import api from '../../api/api';
import DeleteMovie from '../../components/DeleteMovie';

const { Title, Paragraph, Text } = Typography;
const API_URL = import.meta.env.VITE_API_URL;

export default function MovieDetails({ token }) {
   const { id } = useParams();
   const navigate = useNavigate();
   const [movie, setMovie] = useState(null);
   const [loading, setLoading] = useState(true);

   const fetchMovie = async () => {
      setLoading(true);
      try {
         const res = await api.get(`/movies/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setMovie(res.data);
      } catch (err) {
         message.error('Error fetching movie');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchMovie();
   }, [id, token]);

   const onFinish = async (values) => {
      try {
         await api.post(
            `/movies/${id}/reviews`,
            { score: values.score, content: values.content },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         message.success('Review added');
         fetchMovie();
      } catch {
         message.error('Error adding review');
      }
   };

   if (loading) {
      return (
         <div style={{ textAlign: 'center', marginTop: 50 }}>
            <Spin size='large' />
         </div>
      );
   }
   if (!movie) return <Text>Movie not found</Text>;

   return (
      <Card
         style={{ maxWidth: 800, margin: '24px auto' }}
         title={
            <Title level={3} style={{ margin: '16px 0' }}>
               {movie.title}
            </Title>
         }
         extra={
            token && (
               <Space>
                  <Button
                     icon={<EditOutlined />}
                     onClick={() => navigate(`/movies/edit/${id}`)}
                  >
                     Edit Movie
                  </Button>
                  <DeleteMovie
                     token={token}
                     movieId={id}
                     onDeleted={() => navigate('/')}
                  />
               </Space>
            )
         }
      >
         {movie.cover_url ? (
            <img
               src={`${API_URL}${movie.cover_url}`}
               alt={movie.title}
               style={{
                  width: '100%',
                  maxHeight: 300,
                  objectFit: 'contain',
                  marginBottom: 16,
               }}
            />
         ) : (
            <img
               src='https://yaktribe.games/community/media/placeholder-jpg.84782/full'
               alt='default cover'
               style={{
                  width: '100%',
                  maxHeight: 300,
                  objectFit: 'contain',
                  marginBottom: 16,
               }}
            />
         )}

         <Paragraph style={{ textAlign: 'center' }}>
            <StarOutlined /> Rating:{' '}
            <Text strong>{movie.rating.toFixed(1)}</Text>
         </Paragraph>
         <Paragraph style={{ textAlign: 'center' }}>
            <CommentOutlined /> Genre:{' '}
            <Text strong>{movie.genre?.name ?? '—'}</Text>
         </Paragraph>

         <Divider>Reviews</Divider>

         <List
            dataSource={movie.reviews}
            locale={{ emptyText: 'No reviews yet' }}
            renderItem={(r) => (
               <List.Item>
                  <Text>
                     <Text strong>{r.score}/10</Text>: {r.content}
                  </Text>
               </List.Item>
            )}
         />

         {token && (
            <>
               <Divider>Add a Review</Divider>
               <Form
                  layout='vertical'
                  onFinish={onFinish}
                  style={{ maxWidth: 500 }}
               >
                  <Form.Item
                     name='score'
                     label='Score (1–10)'
                     rules={[
                        { required: true, message: 'Please input a score' },
                        {
                           type: 'number',
                           min: 1,
                           max: 10,
                           message: 'Score must be between 1 and 10',
                        },
                     ]}
                  >
                     <InputNumber min={1} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                     name='content'
                     label='Your review'
                     rules={[
                        { required: true, message: 'Please input your review' },
                     ]}
                  >
                     <Input.TextArea rows={4} />
                  </Form.Item>
                  <Form.Item>
                     <Button type='primary' htmlType='submit'>
                        Submit Review
                     </Button>
                  </Form.Item>
               </Form>
            </>
         )}
      </Card>
   );
}
