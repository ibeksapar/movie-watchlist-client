import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function About() {
   return (
      <Card style={{ maxWidth: 800, margin: '24px auto', padding: '24px' }}>
         <Title level={2}>About Movie Watchlist</Title>
         <Paragraph>
            Welcome to <strong>Movie Watchlist</strong> — your personal app to
            discover, track, and review your favorite movies. Built with Go,
            React, and Ant Design, our platform allows you to:
         </Paragraph>
         <Paragraph>
            • Browse movies by genre, title, and rating
            <br />
            • Add, update, and delete movies (authenticated users)
            <br />
            • Write and manage your own reviews
            <br />• Secure authentication with JWT
         </Paragraph>
         <Paragraph>
            This project is maintained as a demonstration of a modern full-\
            stack application architecture and best practices in
            containerization, API design, and responsive UI.
         </Paragraph>
         <Paragraph>
            ©2025 Movie Watchlist · Built with Go, Gin, GORM, React, and Ant
            Design.
         </Paragraph>
      </Card>
   );
}
