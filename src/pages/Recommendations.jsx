import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { activitiesAPI, historyAPI } from '../services/api';
import ActivityCard from '../components/ActivityCard';
import ResponsiveContainer from '../components/ResponsiveContainer';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mood, time, minBudget, maxBudget, userLocation } = location.state || {};
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Определяем погоду на основе температуры
  const getWeatherType = (temp) => {
    if (temp === null) return 'any';
    if (temp > 20) return 'sunny';
    if (temp > 10) return 'cloudy';
    return 'rainy';
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError('');
        
        const filters = {
          time: time,
          minBudget: minBudget,
          maxBudget: maxBudget,
          mood: mood,
          weather: userLocation ? getWeatherType(userLocation.temperature) : 'any'
        };

        console.log('🚀 Отправляем запрос с фильтрами:', filters);
        console.log('🌡️ Температура:', userLocation?.temperature);
        console.log('🌤️ Определенная погода:', getWeatherType(userLocation?.temperature));

        const data = await activitiesAPI.getActivities(filters);
        console.log('📦 Полученные данные:', data);
        console.log('📊 Количество активностей:', data.length);
        
        setActivities(data);
      } catch (err) {
        console.error('❌ Ошибка загрузки активностей:', err);
        setError('Не удалось загрузить рекомендации. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [mood, time, minBudget, maxBudget, userLocation]);

  const handleSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  const handleActivityClick = async (activityId) => {
    try {
      await historyAPI.addToHistory(activityId);
    } catch (err) {
      console.error('Ошибка добавления в историю:', err);
    }
  };

  return (
    <Box sx={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #F5F5F5 0%, #E6ECEF 100%)',
      pt: { xs: 3, md: 4 },
      pb: { xs: 10, md: 4 },
      px: { xs: 2, md: 4 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography variant="h5" fontWeight={700} sx={{ 
        mb: 2, 
        mt: 1, 
        textAlign: 'center',
        fontSize: { xs: '1.5rem', md: '2rem', lg: '2.5rem' }
      }}>
        Твои рекомендации
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: '#FFD60A' }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      ) : activities.length === 0 ? (
        <Typography color="#888" sx={{ mt: 6, mb: 4, fontSize: 18, textAlign: 'center' }}>
          Нет подходящих вариантов.<br/>Попробуй изменить фильтры!
        </Typography>
      ) : (
        <ResponsiveContainer maxWidth="xl">
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            flexWrap: { md: 'wrap' },
            gap: { xs: 2, md: 3 },
            justifyContent: { md: 'center' }
          }}>
          {activities.map((activity, idx) => (
            <Slide in direction="up" timeout={350 + idx * 100} key={activity.id || activity.name + idx}>
              <div style={{ 
                width: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' },
                minWidth: { md: 300 }
              }}>
                <ActivityCard 
                  activity={activity} 
                  onFavorite={() => handleSnackbar('Добавлено в избранное!')}
                  onRate={() => handleSnackbar('Спасибо за оценку!')}
                  onClick={() => handleActivityClick(activity.id)}
                />
              </div>
            </Slide>
          ))}
          </Box>
        </ResponsiveContainer>
      )}
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: 6,
            borderColor: '#FFD60A',
            color: '#FFD60A',
            fontWeight: 600,
            fontSize: 14,
            px: 3,
            py: 1,
            '&:hover': { 
              borderColor: '#FFE066',
              color: '#FFE066'
            },
          }}
          onClick={async () => {
            try {
              console.log('🧪 Тестируем запрос без фильтров...');
              const data = await activitiesAPI.getActivities({});
              console.log('🧪 Все активности без фильтров:', data);
              setActivities(data);
            } catch (err) {
              console.error('❌ Ошибка тестового запроса:', err);
            }
          }}
        >
          Показать все
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: 6,
            background: '#FFD60A',
            color: '#213547',
            fontWeight: 700,
            fontSize: 16,
            px: 4,
            py: 1.2,
            boxShadow: '0 2px 12px #FFD60A22',
            textShadow: '0 1px 4px #fff8',
            '&:hover': { background: '#FFE066' },
          }}
          onClick={() => navigate('/')}
        >
          Новые рекомендации
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1800}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Recommendations; 