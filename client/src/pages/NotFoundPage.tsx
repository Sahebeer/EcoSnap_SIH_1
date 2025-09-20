import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Button, Container } from '@mui/material';
import { Home, Co2Outlined } from '@mui/icons-material';

const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Co2Outlined sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h1" color="primary" fontWeight="600" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          size="large"
          startIcon={<Home />}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;