import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
   Card,
   Form,
   Input,
   InputNumber,
   Select,
   Button,
   message,
   Spin,
   Typography,
   Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../api/api';
import DeleteMovie from '../../components/DeleteMovie';

const { Title } = Typography;
const { Option } = Select;

export default function UpdateMovie({ token }) {
   const { id } = useParams();
   const navigate = useNavigate();
   const [genres, setGenres] = useState([]);
   const [loading, setLoading] = useState(true);
   const [coverUrl, setCoverUrl] = useState('');
   const [form] = Form.useForm();

   useEffect(() => {
      Promise.all([
         api.get('/genres'),
         api.get(`/movies/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
         }),
      ])
         .then(([gRes, mRes]) => {
            setGenres(gRes.data);
            const movie = mRes.data;
            form.setFieldsValue({
               title: movie.title,
               rating: movie.rating,
               genre_id: movie.genre_id,
            });
            setCoverUrl(movie.cover_url || '');
         })
         .catch(() => message.error('Error loading data'))
         .finally(() => setLoading(false));
   }, [id, token, form]);

   const handleUpload = async ({ file, onSuccess, onError }) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
         const { data } = await api.post(`/movies/${id}/upload`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
               Authorization: `Bearer ${token}`,
            },
         });
         setCoverUrl(data.url);
         onSuccess(null, file);
         message.success('Cover updated');
      } catch (err) {
         console.error(err);
         onError(err);
         message.error('Upload failed');
      }
   };

   const onFinish = async (values) => {
      try {
         await api.put(
            `/movies/${id}`,
            { ...values, cover_url: coverUrl },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         message.success('Movie updated');
         navigate('/');
      } catch {
         message.error('Error updating movie');
      }
   };

   if (loading) {
      return (
         <div style={{ textAlign: 'center', marginTop: 50 }}>
            <Spin />
         </div>
      );
   }

   return (
      <Card style={{ maxWidth: 600, margin: '24px auto' }}>
         <Title level={3}>Update Movie</Title>
         <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item label='Cover Image'>
               <Upload
                  name='file'
                  listType='picture'
                  maxCount={1}
                  customRequest={handleUpload}
                  showUploadList={false}
               >
                  <Button icon={<UploadOutlined />}>Change Cover</Button>
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
               label='Title'
               name='title'
               rules={[{ required: true, message: 'Please enter title' }]}
            >
               <Input />
            </Form.Item>
            <Form.Item
               label='Rating'
               name='rating'
               rules={[
                  { required: true, message: 'Please enter rating' },
                  { type: 'number', min: 1, max: 10, message: '1–10 only' },
               ]}
            >
               <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
               label='Genre'
               name='genre_id'
               rules={[{ required: true, message: 'Please select genre' }]}
            >
               <Select placeholder='Select genre'>
                  {genres.map((g) => (
                     <Option key={g.id} value={g.id}>
                        {g.name}
                     </Option>
                  ))}
               </Select>
            </Form.Item>

            <Form.Item>
               <Button
                  type='primary'
                  htmlType='submit'
                  style={{ marginRight: 8 }}
               >
                  Save Changes
               </Button>
               <DeleteMovie
                  token={token}
                  movieId={id}
                  onDeleted={() => navigate('/')}
               />
            </Form.Item>
         </Form>
      </Card>
   );
}
