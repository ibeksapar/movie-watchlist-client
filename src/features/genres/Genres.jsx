import { useEffect, useState } from 'react';
import {
   Card,
   Typography,
   Form,
   Input,
   Button,
   Table,
   Popconfirm,
   message,
   Space,
} from 'antd';
import api from '../../api/api';

const { Title } = Typography;

export default function Genres({ token }) {
   const [genres, setGenres] = useState([]);
   const [editingGenre, setEditingGenre] = useState(null);
   const [form] = Form.useForm();

   const loadGenres = async () => {
      try {
         const res = await api.get('/genres', {
            headers: { Authorization: `Bearer ${token}` },
         });
         setGenres(res.data);
      } catch (err) {
         message.error('Failed to load genres');
      }
   };

   useEffect(() => {
      loadGenres();
   }, []);

   const onFinish = async (values) => {
      try {
         if (editingGenre) {
            await api.put(
               `/genres/${editingGenre.id}`,
               { name: values.name, description: values.description },
               { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success('Genre updated');
         } else {
            await api.post(
               '/genres',
               { name: values.name, description: values.description },
               { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success('Genre created');
         }
         form.resetFields();
         setEditingGenre(null);
         loadGenres();
      } catch (err) {
         message.error('Error saving genre');
      }
   };

   const handleEdit = (record) => {
      setEditingGenre(record);
      form.setFieldsValue({
         name: record.name,
         description: record.description,
      });
   };

   const handleDelete = async (id) => {
      try {
         await api.delete(`/genres/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         message.success('Genre deleted');
         loadGenres();
      } catch (err) {
         message.error('Error deleting genre');
      }
   };

   const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      {
         title: 'Actions',
         key: 'actions',
         render: (_, record) => (
            <Space>
               <Button type='link' onClick={() => handleEdit(record)}>
                  Edit
               </Button>
               <Popconfirm
                  title='Are you sure delete this genre?'
                  onConfirm={() => handleDelete(record.id)}
               >
                  <Button type='link' danger>
                     Delete
                  </Button>
               </Popconfirm>
            </Space>
         ),
      },
   ];

   return (
      <Card style={{ maxWidth: 800, margin: 'auto' }}>
         <Title level={3}>Manage Genres</Title>

         <Form
            form={form}
            layout='inline'
            onFinish={onFinish}
            style={{ marginBottom: 24 }}
         >
            <Form.Item
               name='name'
               rules={[{ required: true, message: 'Please input genre name' }]}
            >
               <Input placeholder='Name' />
            </Form.Item>
            <Form.Item name='description'>
               <Input placeholder='Description' />
            </Form.Item>
            <Form.Item>
               <Button type='primary' htmlType='submit'>
                  {editingGenre ? 'Update' : 'Create'}
               </Button>
               {editingGenre && (
                  <Button
                     style={{ marginLeft: 8 }}
                     onClick={() => {
                        form.resetFields();
                        setEditingGenre(null);
                     }}
                  >
                     Cancel
                  </Button>
               )}
            </Form.Item>
         </Form>

         <Table
            dataSource={genres}
            columns={columns}
            rowKey='id'
            pagination={false}
         />
      </Card>
   );
}
