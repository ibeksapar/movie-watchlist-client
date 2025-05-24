import { useState } from 'react';
import { ConfigProvider, theme, Layout, Menu, Typography, Switch } from 'antd';
import {
   LoginOutlined,
   LogoutOutlined,
   InfoCircleOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function AppLayout({ children, token, setToken }) {
   const [isDark, setIsDark] = useState(true);
   const { pathname } = useLocation();
   const navigate = useNavigate();

   const themeAlgorithm = isDark ? theme.darkAlgorithm : theme.defaultAlgorithm;

   const items = [
      !token && {
         key: '/login',
         icon: <LoginOutlined />,
         label: <Link to='/login'>Sign In</Link>,
      },
      token && {
         key: '/logout',
         icon: <LogoutOutlined />,
         label: (
            <span
               onClick={() => {
                  localStorage.removeItem('token');
                  setToken(null);
                  navigate('/login', { replace: true });
               }}
            >
               Logout
            </span>
         ),
      },
      {
         key: '/about',
         icon: <InfoCircleOutlined />,
         label: <Link to='/about'>About Us</Link>,
      },
   ].filter(Boolean);

   let selectedKey;
   if (pathname === '/login') selectedKey = '/login';
   else if (pathname === '/about') selectedKey = '/about';
   else if (pathname === '/logout') selectedKey = '/logout';

   const headerBg = isDark ? '#141414' : '#fff';

   return (
      <ConfigProvider theme={{ algorithm: themeAlgorithm }}>
         <Layout style={{ minHeight: '100vh' }}>
            <Header
               style={{
                  background: headerBg,
                  position: 'sticky',
                  top: 0,
                  zIndex: 100,
                  padding: '0 24px',
               }}
            >
               <div
                  style={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'space-between',
                  }}
               >
                  <Title level={4} style={{ margin: 0 }}>
                     <Link to='/' style={{ color: 'inherit' }}>
                        Movie Watchlist
                     </Link>
                  </Title>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <Switch
                        checkedChildren='🌙'
                        unCheckedChildren='☀️'
                        checked={isDark}
                        onChange={() => setIsDark(!isDark)}
                        style={{ marginRight: 16 }}
                     />

                     <Menu
                        theme={isDark ? 'dark' : 'light'}
                        mode='horizontal'
                        selectedKeys={selectedKey ? [selectedKey] : []}
                        items={items}
                        style={{ background: 'transparent' }}
                     />
                  </div>
               </div>
            </Header>

            <Content
               style={{
                  padding: '24px',
                  maxWidth: 1000,
                  margin: 'auto',
                  width: '100%',
               }}
            >
               {children}
            </Content>

            <Footer
               style={{
                  textAlign: 'center',
                  background: headerBg,
               }}
            >
               ©2025 Movie Watchlist
            </Footer>
         </Layout>
      </ConfigProvider>
   );
}
