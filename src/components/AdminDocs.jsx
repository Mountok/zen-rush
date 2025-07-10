import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Api as ApiIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';

const AdminDocs = () => {
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} color="#213547" sx={{ mb: 3 }}>
        📚 Документация для администратора
      </Typography>

      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon sx={{ color: '#FFD60A' }} />
            <Typography fontWeight={600}>Права доступа</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Роли пользователей"
                secondary={
                  <Box>
                    <Chip label="user" size="small" sx={{ mr: 1, mb: 1 }} />
                    <Chip label="moderator" size="small" color="warning" sx={{ mr: 1, mb: 1 }} />
                    <Chip label="admin" size="small" color="error" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      • user - обычный пользователь, может просматривать активности и добавлять в избранное
                      • moderator - может управлять активностями (создавать, редактировать, удалять)
                      • admin - полные права администратора
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Доступ к админ-панели"
                secondary="Только пользователи с ролью moderator или admin могут получить доступ к админ-панели. Обычные пользователи будут перенаправлены на главную страницу."
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ApiIcon sx={{ color: '#FFD60A' }} />
            <Typography fontWeight={600}>API Endpoints</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="GET /api/activities"
                secondary="Получить все активности (для админов - без фильтров)"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="POST /api/activities"
                secondary="Создать новую активность (требует роль moderator/admin)"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="PUT /api/activities/:id"
                secondary="Обновить активность (требует роль moderator/admin)"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="DELETE /api/activities/:id"
                secondary="Удалить активность (требует роль moderator/admin)"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="GET /api/favorites"
                secondary="Получить избранное пользователя"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="POST /api/favorites/:id"
                secondary="Добавить активность в избранное"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="DELETE /api/favorites/:id"
                secondary="Удалить активность из избранного"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="GET /api/history"
                secondary="Получить историю просмотров"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="POST /api/history/:id"
                secondary="Добавить просмотр активности"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon sx={{ color: '#FFD60A' }} />
            <Typography fontWeight={600}>Структура данных</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" sx={{ mb: 2 }}>Активность (Activity)</Typography>
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5', fontFamily: 'monospace', fontSize: '0.9rem' }}>
{`{
  "id": 1,
  "name": "Название активности",
  "description": "Описание активности",
  "budget": 1000,
  "time": 2,
  "weather": "sunny",
  "moods": ["Весело", "Хорошо"],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}`}
          </Paper>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Пользователь (User)</Typography>
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5', fontFamily: 'monospace', fontSize: '0.9rem' }}>
{`{
  "id": 1,
  "username": "user123",
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z"
}`}
          </Paper>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Допустимые значения</Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="weather"
                secondary="any, sunny, cloudy, rainy"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="moods"
                secondary="Очень грустно, Грустно, Спокойно, Нейтрально, Хорошо, Весело, Вдохновлён"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="budget"
                secondary="Число в рублях (0 и больше)"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="time"
                secondary="Число часов (1 и больше)"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReportIcon sx={{ color: '#FFD60A' }} />
            <Typography fontWeight={600}>Устранение неполадок</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Ошибка 401 Unauthorized"
                secondary="Проверьте JWT токен. Возможно, он истек или недействителен. Попробуйте перелогиниться."
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Ошибка 403 Forbidden"
                secondary="У вас недостаточно прав для выполнения операции. Проверьте роль пользователя."
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Ошибка 404 Not Found"
                secondary="Запрашиваемый ресурс не найден. Проверьте правильность URL и ID."
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Ошибка 500 Internal Server Error"
                secondary="Внутренняя ошибка сервера. Проверьте логи сервера и обратитесь к разработчику."
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="CORS ошибки"
                secondary="Убедитесь, что сервер правильно настроен для CORS и разрешает запросы с вашего домена."
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Примечание:</strong> Все изменения в админ-панели сразу отражаются в базе данных. 
          Будьте осторожны при удалении активностей, так как это действие необратимо.
        </Typography>
      </Alert>
    </Box>
  );
};

export default AdminDocs; 