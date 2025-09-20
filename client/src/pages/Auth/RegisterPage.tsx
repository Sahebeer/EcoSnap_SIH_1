import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Button,
} from '@mui/material';
import { Co2Outlined } from '@mui/icons-material';

const RegisterPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ maxWidth: 450, mx: 'auto' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Co2Outlined sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Typography variant="h4" fontWeight="600" color="primary" gutterBottom>
              EcoSnap
            </Typography>
            <Typography variant="h6" gutterBottom>
              Registration Coming Soon!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Registration functionality will be implemented soon. 
              For now, please use the demo credentials to explore the application.
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;