import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import auth from '../../api/auth';

const { Title, Text } = Typography;

export default function Login({ setToken }) {
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const onFinish = async ({ username, password }) => {
      setLoading(true);
      try {
         const { data } = await auth.post('/login', { username, password });
         localStorage.setItem('token', data.token);
         setToken(data.token);
         message.success('Logged in successfully! Redirecting…');
         setTimeout(() => navigate('/', { replace: true }), 1500);
      } catch (err) {
         message.error('Invalid credentials');
      } finally {
         setLoading(false);
      }
   };

   return (
      <Card style={{ maxWidth: 400, margin: 'auto', marginTop: '30px' }}>
         <Title level={3} style={{ textAlign: 'center' }}>
            Login
         </Title>
         <Form
            layout='vertical'
            onFinish={onFinish}
            initialValues={{ username: '', password: '' }}
         >
            <Form.Item
               name='username'
               label='Username'
               rules={[
                  { required: true, message: 'Please enter your username' },
               ]}
            >
               <Input placeholder='Username' />
            </Form.Item>

            <Form.Item
               name='password'
               label='Password'
               rules={[
                  { required: true, message: 'Please enter your password' },
               ]}
            >
               <Input.Password placeholder='Password' />
            </Form.Item>

            <Form.Item>
               <Button type='primary' htmlType='submit' block loading={loading}>
                  Login
               </Button>
            </Form.Item>
         </Form>

         <Text>
            Don't have an account? <Link to='/register'>Sign Up</Link>.
         </Text>
      </Card>
   );
}
