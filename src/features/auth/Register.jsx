import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../../api/auth';

const { Title, Text } = Typography;

export default function Register() {
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const onFinish = async ({ username, password }) => {
      setLoading(true);
      try {
         await auth.post('/register', { username, password });
         message.success('Registration successful! Redirecting to login...');
         setTimeout(() => navigate('/login'), 1500);
      } catch (err) {
         const errMsg = err.response?.data?.error || 'Registration failed';
         message.error(errMsg);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Card style={{ maxWidth: 400, margin: 'auto', marginTop: '30px' }}>
         <Title level={3} style={{ textAlign: 'center' }}>
            Sign Up
         </Title>
         <Form layout='vertical' onFinish={onFinish}>
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
                  Sign Up
               </Button>
            </Form.Item>
         </Form>

         <Text>
            Already have an account? <Link to='/login'>Log in</Link>.
         </Text>
      </Card>
   );
}
