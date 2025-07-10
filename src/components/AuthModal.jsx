import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { authAPI } from '../services/api';

const AuthModal = ({ open, onClose, onSuccess }) => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    setFormData({ username: '', password: '', confirmPassword: '' });
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (tab === 0) {
        // Логин
        if (!formData.username || !formData.password) {
          throw new Error('Заполните все поля');
        }
        await authAPI.login(formData.username, formData.password);
      } else {
        // Регистрация
        if (!formData.username || !formData.password || !formData.confirmPassword) {
          throw new Error('Заполните все поля');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Пароли не совпадают');
        }
        if (formData.password.length < 6) {
          throw new Error('Пароль должен содержать минимум 6 символов');
        }
        await authAPI.register(formData.username, formData.password);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Вход" />
          <Tab label="Регистрация" />
        </Tabs>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Имя пользователя"
            value={formData.username}
            onChange={handleInputChange('username')}
            onKeyPress={handleKeyPress}
            fullWidth
            size="small"
          />
          
          <TextField
            label="Пароль"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            onKeyPress={handleKeyPress}
            fullWidth
            size="small"
          />

          {tab === 1 && (
            <TextField
              label="Подтвердите пароль"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              onKeyPress={handleKeyPress}
              fullWidth
              size="small"
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          sx={{ color: '#666' }}
        >
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            background: '#FFD60A',
            color: '#213547',
            fontWeight: 600,
            '&:hover': {
              background: '#FFE066',
            },
            '&:disabled': {
              background: '#ccc',
              color: '#666'
            }
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: '#213547' }} />
          ) : (
            tab === 0 ? 'Войти' : 'Зарегистрироваться'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal; 