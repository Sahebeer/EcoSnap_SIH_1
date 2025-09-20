import React from 'react';
import { Typography, Box } from '@mui/material';

const AdminUsersPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will allow administrators to manage user accounts, view user details, and moderate user activity.
      </Typography>
    </Box>
  );
};

export default AdminUsersPage;