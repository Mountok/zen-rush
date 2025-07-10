import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const MOOD_OPTIONS = [
  { label: "Очень грустно", color: "#4A90E2" },
  { label: "Грустно", color: "#A0A0A0" },
  { label: "Спокойно", color: "#A3BFFA" },
  { label: "Нейтрально", color: "#FFD60A" },
  { label: "Хорошо", color: "#A9CBA4" },
  { label: "Весело", color: "#4CD964" },
  { label: "Вдохновлён", color: "#FF9500" },
];

const getMoodColor = (moodIndex) => MOOD_OPTIONS[moodIndex]?.color || "#A9CBA4";

const Home = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [mood, setMood] = useState(3.0); // по умолчанию "Нейтрально"
  const [time, setTime] = useState(1);
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(10000);
  const [temperature, setTemperature] = useState(null);
  const [city, setCity] = useState('Город');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[Geo] useEffect запущен');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          console.log('[Geo] Получены координаты:', coords);
          setUserLocation(coords);
        },
        (error) => {
          console.log('[Geo] Ошибка геолокации:', error);
          setGeoError(error.message);
        }
      );
    } else {
      console.log('[Geo] Геолокация не поддерживается браузером');
      setGeoError("Геолокация не поддерживается браузером");
    }
  }, []);

  useEffect(() => {
    console.log('[Geo] userLocation изменился:', userLocation);
  }, [userLocation]);

  useEffect(() => {
    console.log('[Geo] geoError изменился:', geoError);
  }, [geoError]);

  useEffect(() => {
    if (userLocation) {
      const fetchWeather = async () => {
        const accessKey = 'c482ac0a-4de8-4540-a232-da6c72b6d770';
        const headers = {
          'X-Yandex-Weather-Key': accessKey
        };
        const url = `https://api.weather.yandex.ru/v2/forecast?lat=${userLocation.lat}&lon=${userLocation.lon}`;
        try {
          console.log('[Weather] Запрос:', url, headers);
          const response = await axios.get(url, { headers });
          console.log('[Weather] Ответ:', response.data);
          setTemperature(Math.round(response.data.fact.temp));
        } catch (err) {
          console.log('[Weather] Ошибка:', err);
          setTemperature(null);
        }
      };
      fetchWeather();
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      // Получение города через Geoapify
      const fetchCity = async () => {
        const apiKey = '1b8c4d845762401eadc02ee91389b1ff';
        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${userLocation.lat}&lon=${userLocation.lon}&type=city&lang=ru&apiKey=${apiKey}`;
        try {
          const response = await axios.get(url);
          const cityName = response.data.features[0]?.properties?.city;
          setCity(cityName || 'Город');
        } catch (err) {
          setCity('Город');
        }
      };
      fetchCity();
    }
  }, [userLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const moodIndex = Math.round(mood);
    navigate("/recommendations", {
      state: { mood: MOOD_OPTIONS[moodIndex].label, time, minBudget, maxBudget, userLocation },
    });
  };

  return (
    <Box sx={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #F5F5F5 0%, #E6ECEF 100%)',
      overflow: 'hidden',
      pb: 7,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
      <Paper elevation={3} sx={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: 3,
        px: 2,
        py: 0.5,
        bgcolor: '#fff',
        color: '#4A4039',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        zIndex: 10,
        fontSize: 14,
        minWidth: 220,
        maxWidth: 320,
      }}>
        <Typography variant="body2" fontWeight={600}>
          ☀️ {city}
          {temperature !== null ? `: ${temperature}°C` : ""}
        </Typography>
      </Paper>
      {/* Волны */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 0 }}>
        <svg height="80" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
          <path d="M0,60 C480,120 960,0 1440,60 L1440,0 L0,0 Z" fill="#A3BFFA" fillOpacity="0.18" />
        </svg>
      </Box>
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        pt: 6,
        px: 0,
      }}>
        <Paper elevation={4} sx={{
          width: '100%',
          maxWidth: 420,
          mx: 'auto',
          borderRadius: 2.5,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 4px 24px #A3BFFA22',
          background: '#fff',
        }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#213547', mb: 0.5, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: 19 }}>
            Куда сходить?
            <br />Получить рекомендации!
          </Typography>
          {/* Настроение */}
          <Box sx={{ width: '100%' }}>
            <Typography fontWeight={600} fontSize={13} mb={0.2} color="#213547">
              Настроение
            </Typography>
            <Typography fontSize={15} fontWeight={700} color={getMoodColor(Math.round(mood))} mb={0.2} minHeight={18}>
              {MOOD_OPTIONS[Math.round(mood)].label}
            </Typography>
            <Slider
              id="mood"
              min={0}
              max={MOOD_OPTIONS.length - 1}
              value={mood}
              onChange={(_, val) => setMood(Number(val))}
              step={0.01}
              marks={false}
              sx={{
                width: '100%',
                color: getMoodColor(Math.round(mood)),
                mb: 0,
                mt: 0.2,
                '& .MuiSlider-thumb': {
                  bgcolor: getMoodColor(Math.round(mood)),
                  border: '2px solid #fff',
                  width: 14,
                  height: 14,
                  transition: 'background 0.3s, border-color 0.3s',
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                  bgcolor: getMoodColor(Math.round(mood)),
                  transition: 'background 0.3s',
                },
                '& .MuiSlider-track': {
                  bgcolor: getMoodColor(Math.round(mood)),
                  transition: 'background 0.3s',
                },
                height: 4,
              }}
            />
          </Box>
          {/* Время */}
          <Box sx={{ width: '100%' }}>
            <Typography fontWeight={600} fontSize={13} mb={0.2} color="#213547">Время (часы)</Typography>
            <Slider
              id="time"
              min={1}
              max={24}
              value={time}
              onChange={(_, val) => setTime(Number(val))}
              step={1}
              sx={{
                color: '#A9CBA4',
                width: '100%',
                mb: 0.2,
                '& .MuiSlider-thumb': {
                  width: 14,
                  height: 14,
                },
                height: 4,
              }}
            />
            <Typography textAlign="center" fontWeight={500} fontSize={13}>{time} {time === 1 ? "час" : time < 5 ? "часа" : "часов"}</Typography>
          </Box>
          {/* Бюджет */}
          <Box sx={{ width: '100%', display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TextField
              label="от"
              type="number"
              size="small"
              inputProps={{ min: 0, max: maxBudget, style: { textAlign: 'center', fontSize: 13, padding: 4 } }}
              value={minBudget}
              onChange={e => setMinBudget(Number(e.target.value))}
              sx={{ width: 60 }}
            />
            <Typography fontWeight={600} color="#888">—</Typography>
            <TextField
              label="до"
              type="number"
              size="small"
              inputProps={{ min: minBudget, max: 10000, style: { textAlign: 'center', fontSize: 13, padding: 4 } }}
              value={maxBudget}
              onChange={e => setMaxBudget(Number(e.target.value))}
              sx={{ width: 60 }}
            />
            <Typography fontWeight={600} color="#888">₽</Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 4,
              background: '#FFD60A',
              color: '#213547',
              fontWeight: 700,
              fontSize: 15,
              py: 0.7,
              boxShadow: '0 2px 12px #FFD60A22',
              textShadow: '0 1px 4px #fff8',
              width: '100%',
              mt: 0.5,
              minHeight: 36,
              '&:hover': {
                background: '#FFE066',
              },
            }}
            onClick={handleSubmit}
          >
            Получить рекомендации
          </Button>
          {geoError && <Typography color="#e74c3c" mt={1} fontSize={13}>{geoError}</Typography>}
        </Paper>
      </Box>
    </Box>
  );
};

export default Home; 