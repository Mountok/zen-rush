import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { activitiesAPI } from '../services/api';
import { userService } from '../services/userService';
import AdminDocs from '../components/AdminDocs';

const AdminPanel = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showDocs, setShowDocs] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: 0,
    time: 1,
    weather: 'any',
    moods: []
  });

  const weatherOptions = [
    { value: 'any', label: 'Любая' },
    { value: 'sunny', label: 'Солнечно' },
    { value: 'cloudy', label: 'Облачно' },
    { value: 'rainy', label: 'Дождь' }
  ];

  const moodOptions = [
    'Очень грустно', 'Грустно', 'Спокойно', 'Нейтрально', 
    'Хорошо', 'Весело', 'Вдохновлён'
  ];

  // Загружаем все активности
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await activitiesAPI.getActivities();
      setActivities(data);
    } catch (err) {
      console.error('Ошибка загрузки активностей:', err);
      setError('Не удалось загрузить активности');
    } finally {
      setLoading(false);
    }
  };

  // Открыть диалог для создания/редактирования
  const handleOpenDialog = (activity = null) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        name: activity.name,
        description: activity.description,
        budget: activity.budget,
        time: activity.time,
        weather: activity.weather,
        moods: activity.moods || []
      });
    } else {
      setEditingActivity(null);
      setFormData({
        name: '',
        description: '',
        budget: 0,
        time: 1,
        weather: 'any',
        moods: []
      });
    }
    setOpenDialog(true);
  };

  // Закрыть диалог
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingActivity(null);
  };

  // Обработка изменения формы
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Сохранение активности
  const handleSave = async () => {
    try {
      if (editingActivity) {
        await activitiesAPI.updateActivity(editingActivity.id, formData);
      } else {
        await activitiesAPI.createActivity(formData);
      }
      handleCloseDialog();
      loadActivities();
    } catch (err) {
      console.error('Ошибка сохранения активности:', err);
      setError('Не удалось сохранить активность');
    }
  };

  // Удаление активности
  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту активность?')) {
      try {
        await activitiesAPI.deleteActivity(id);
        loadActivities();
      } catch (err) {
        console.error('Ошибка удаления активности:', err);
        setError('Не удалось удалить активность');
      }
    }
  };

  // Проверяем права доступа
  if (!userService.isModerator()) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">
          У вас нет прав для доступа к админ-панели
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #F5F5F5 0%, #E6ECEF 100%)',
      pt: { xs: 2, md: 4 },
      pb: { xs: 10, md: 4 },
      px: { xs: 2, md: 4 },
    }}>
      <Paper elevation={4} sx={{
        maxWidth: { xs: '100%', md: 1200, lg: 1400 },
        mx: 'auto',
        borderRadius: 3,
        p: { xs: 3, md: 4 },
        boxShadow: '0 4px 24px #A3BFFA22',
      }}>
        {/* Заголовок */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <AdminIcon sx={{ color: '#FFD60A', fontSize: 32 }} />
                  <Typography variant="h4" fontWeight={700} color="#213547" sx={{
          fontSize: { xs: '1.5rem', md: '2rem', lg: '2.5rem' }
        }}>
          Админ-панель
        </Typography>
          <Chip 
            label={userService.getUserRole()} 
            color="primary" 
            size="small"
            sx={{ ml: 'auto' }}
          />
        </Box>

        {/* Кнопки управления */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: '#FFD60A',
              color: '#213547',
              fontWeight: 600,
              '&:hover': { background: '#FFE066' }
            }}
          >
            Добавить активность
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<HelpIcon />}
            onClick={() => setShowDocs(!showDocs)}
            sx={{
              borderColor: '#4A90E2',
              color: '#4A90E2',
              fontWeight: 600,
              '&:hover': { 
                borderColor: '#357ABD',
                backgroundColor: '#F0F8FF'
              }
            }}
          >
            {showDocs ? 'Скрыть документацию' : 'Показать документацию'}
          </Button>
        </Box>

        {/* Ошибки */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Документация */}
        {showDocs && (
          <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
            <AdminDocs />
          </Paper>
        )}

        {/* Таблица активностей */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#FFD60A' }} />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F8FF' }}>
                  <TableCell fontWeight={600}>Название</TableCell>
                  <TableCell fontWeight={600}>Описание</TableCell>
                  <TableCell fontWeight={600}>Бюджет</TableCell>
                  <TableCell fontWeight={600}>Время</TableCell>
                  <TableCell fontWeight={600}>Погода</TableCell>
                  <TableCell fontWeight={600}>Настроения</TableCell>
                  <TableCell fontWeight={600}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id} hover>
                    <TableCell fontWeight={600}>{activity.name}</TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>{activity.budget} ₽</TableCell>
                    <TableCell>{activity.time} ч</TableCell>
                    <TableCell>
                      <Chip 
                        label={weatherOptions.find(w => w.value === activity.weather)?.label || activity.weather}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {activity.moods?.map((mood, idx) => (
                          <Chip key={idx} label={mood} size="small" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(activity)}
                          sx={{ color: '#4A90E2' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(activity.id)}
                          sx={{ color: '#E74C3C' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Диалог создания/редактирования */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingActivity ? 'Редактировать активность' : 'Создать активность'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Название"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              fullWidth
              required
            />
            
            <TextField
              label="Описание"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
              required
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Бюджет (₽)"
                type="number"
                value={formData.budget}
                onChange={(e) => handleFormChange('budget', Number(e.target.value))}
                fullWidth
                required
              />
              
              <TextField
                label="Время (часы)"
                type="number"
                value={formData.time}
                onChange={(e) => handleFormChange('time', Number(e.target.value))}
                fullWidth
                required
              />
            </Box>
            
            <FormControl fullWidth>
              <InputLabel>Погода</InputLabel>
              <Select
                value={formData.weather}
                onChange={(e) => handleFormChange('weather', e.target.value)}
                label="Погода"
              >
                {weatherOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Настроения</InputLabel>
              <Select
                multiple
                value={formData.moods}
                onChange={(e) => handleFormChange('moods', e.target.value)}
                input={<OutlinedInput label="Настроения" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {moodOptions.map((mood) => (
                  <MenuItem key={mood} value={mood}>
                    {mood}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{
              background: '#FFD60A',
              color: '#213547',
              '&:hover': { background: '#FFE066' }
            }}
          >
            {editingActivity ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel; 