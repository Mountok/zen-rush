import React from 'react';
import { Navigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { Box, Alert, Typography } from '@mui/material';

const AdminRoute = ({ children }) => {
  const isModerator = userService.isModerator();
  const isAuthenticated = userService.getCurrentUser() !== null;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isModerator) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          У вас нет прав для доступа к админ-панели
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Требуются права администратора или модератора
        </Typography>
      </Box>
    );
  }

  return children;
};

export default AdminRoute; 