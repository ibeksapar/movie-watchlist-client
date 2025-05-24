import { useState, useEffect } from 'react';
import {
   Card,
   Form,
   Input,
   InputNumber,
   Select,
   Button,
   Typography,
   message,
   Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const { Title, Text } = Typography;
const { Option } = Select;

export default function AddMovie({ token }) {
   const [genres, setGenres] = useState([]);
   const [loading, setLoading] = useState(false);
   const [coverUrl, setCoverUrl] = useState('');
   const [countdown, setCountdown] = useState(0);
   const navigate = useNavigate();

   useEffect(() => {
      api.get('/genres')
         .then((res) => setGenres(res.data))
         .catch(() => message.error('Error fetching genres'));
   }, []);

   useEffect(() => {
      let timer;
      if (countdown > 0) {
         timer = setTimeout(() => setCountdown(countdown - 1), 1000);
         if (countdown === 1) {
            message.success('Redirected to home!');
            navigate('/');
         }
      }
      return () => clearTimeout(timer);
   }, [countdown, navigate]);

   const handleUpload = async ({ file, onSuccess, onError }) => {
      const formData = new FormData();
      formData.append('file', file);
      try {
         const { data } = await api.post('/upload', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
               Authorization: `Bearer ${token}`,
            },
         });
         setCoverUrl(data.url);
         onSuccess(null, file);
         message.success('Cover uploaded');
      } catch (err) {
         console.error(err);
         onError(err);
         message.error('Upload failed');
      }
   };

   const onFinish = async (values) => {
      setLoading(true);
      try {
         await api.post(
            '/movies',
            {
               title: values.title,
               rating: values.rating,
               genre_id: values.genre_id,
               cover_url: coverUrl,
            },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         message.success('Movie added! Redirecting...');
         setCountdown(2);
      } catch (err) {
         message.error('Error adding movie');
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Card style={{ maxWidth: 600, margin: '24px auto' }}>
         <Title level={3}>Add Movie</Title>
         <Form layout='vertical' onFinish={onFinish}>
            <Form.Item
               name='cover'
               label='Cover Image'
               extra='Upload a banner image for the movie'
            >
               <Upload
                  name='file'
                  listType='picture'
                  maxCount={1}
                  customRequest={handleUpload}
                  showUploadList={false}
               >
                  <Button icon={<UploadOutlined />}>Upload Cover</Button>
               </Upload>
               {coverUrl && (
                  <img
                     src={coverUrl}
                     alt='cover'
                     style={{
                        marginTop: 8,
                        width: '100%',
                        maxHeight: 300,
                        objectFit: 'contain',
                     }}
                  />
               )}
            </Form.Item>

            <Form.Item
               name='title'
               label='Title'
               rules={[
                  { required: true, message: 'Please input the movie title' },
               ]}
            >
               <Input placeholder='Movie Title' />
            </Form.Item>

            <Form.Item
               name='rating'
               label='Rating'
               rules={[
                  {
                     required: true,
                     message: 'Please input a rating between 1 and 10',
                  },
               ]}
            >
               <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
               name='genre_id'
               label='Genre'
               rules={[{ required: true, message: 'Please select a genre' }]}
            >
               <Select placeholder='Select Genre'>
                  {genres.map((g) => (
                     <Option key={g.id} value={g.id}>
                        {g.name}
                     </Option>
                  ))}
               </Select>
            </Form.Item>

            <Form.Item>
               <Button type='primary' htmlType='submit' loading={loading}>
                  Add Movie
               </Button>
            </Form.Item>
         </Form>

         {countdown > 0 && (
            <Text type='secondary'>
               Redirecting in <Text strong>{countdown}</Text>…
            </Text>
         )}
      </Card>
   );
}
