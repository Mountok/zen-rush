import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { activities } from '../data/activities';
import ActivityCard from '../components/ActivityCard';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mood, time, minBudget, maxBudget } = location.state || {};

  let filtered;
  if (typeof time === 'number' && typeof minBudget === 'number' && typeof maxBudget === 'number') {
    filtered = activities.filter(
      (a) => a.time <= time && a.budget >= minBudget && a.budget <= maxBudget
    ).slice(0, 5);
  } else {
    filtered = activities;
  }

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const handleSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  return (
    <Box sx={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #F5F5F5 0%, #E6ECEF 100%)',
      pt: 3,
      pb: 10,
      px: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2, mt: 1, textAlign: 'center' }}>
        Твои рекомендации
      </Typography>
      {filtered.length === 0 ? (
        <Typography color="#888" sx={{ mt: 6, mb: 4, fontSize: 18, textAlign: 'center' }}>
          Нет подходящих вариантов.<br/>Попробуй изменить фильтры!
        </Typography>
      ) : (
        <Box sx={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map((activity, idx) => (
            <Slide in direction="up" timeout={350 + idx * 100} key={activity.name + idx}>
              <div>
                <ActivityCard 
                  activity={activity} 
                  onFavorite={() => handleSnackbar('Добавлено в избранное!')}
                  onRate={() => handleSnackbar('Спасибо за оценку!')}
                />
              </div>
            </Slide>
          ))}
        </Box>
      )}
      <Button
        variant="contained"
        sx={{
          mt: 4,
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