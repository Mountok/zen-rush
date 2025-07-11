import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления JWT токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => {
    // Обрабатываем null ответы от сервера
    if (response.data === null) {
      console.log('⚠️ Сервер вернул null, заменяем на пустой массив');
      response.data = [];
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Аутентификация
export const authAPI = {
  // Регистрация
  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },

  // Вход в систему
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { token } = response.data;
    localStorage.setItem('jwt_token', token);
    return response.data;
  },

  // Выход
  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  },

  // Проверка авторизации
  isAuthenticated: () => {
    return !!localStorage.getItem('jwt_token');
  }
};

// Активности
export const activitiesAPI = {
  // Получить все активности с фильтрами
  getActivities: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.minBudget !== undefined && filters.minBudget !== null) params.append('min_budget', filters.minBudget);
    if (filters.maxBudget !== undefined && filters.maxBudget !== null) params.append('max_budget', filters.maxBudget);
    if (filters.time !== undefined && filters.time !== null) params.append('time', filters.time);
    if (filters.peopleCount !== undefined && filters.peopleCount !== null) params.append('people_count', filters.peopleCount);
    if (filters.mood !== undefined && filters.mood !== null) params.append('mood', filters.mood);
    if (filters.weather !== undefined && filters.weather !== null) params.append('weather', filters.weather);

    const url = `/activities?${params.toString()}`;
    console.log('🔗 Отправляем запрос на:', API_BASE_URL + url);
    console.log('📋 Параметры фильтрации:', Object.fromEntries(params));
    console.log('🔍 Количество параметров в URL:', params.toString().split('&').length);
    console.log('📝 Полный URL запроса:', API_BASE_URL + url);

    const response = await api.get(url);
    console.log('✅ Ответ от сервера:', response.data);
    return response.data;
  },

  // Получить одну активность по ID
  getActivity: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  // Создать активность (только admin/moderator)
  createActivity: async (activityData) => {
    const response = await api.post('/activities', activityData);
    return response.data;
  },

  // Обновить активность (только admin/moderator)
  updateActivity: async (id, activityData) => {
    const response = await api.put(`/activities/${id}`, activityData);
    return response.data;
  },

  // Удалить активность (только admin/moderator)
  deleteActivity: async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  }
};

// Избранное
export const favoritesAPI = {
  // Получить избранное пользователя
  getFavorites: async () => {
    const response = await api.get('/favorites');
    console.log('📋 Ответ /favorites:', response.data);
    console.log('📋 Тип ответа:', typeof response.data);
    console.log('📋 Является ли массивом:', Array.isArray(response.data));
    
    // Проверяем, что ответ не null/undefined и является массивом
    let result = response.data;
    if (result === null || result === undefined) {
      console.log('⚠️ Ответ null/undefined, заменяем на пустой массив');
      result = [];
    } else if (!Array.isArray(result)) {
      console.log('⚠️ Ответ не является массивом, заменяем на пустой массив');
      result = [];
    }
    
    console.log('📋 Финальный результат избранного:', result);
    return result;
  },

  // Добавить в избранное
  addToFavorites: async (activityId) => {
    const response = await api.post(`/favorites/${activityId}`);
    return response.data;
  },

  // Удалить из избранного
  removeFromFavorites: async (activityId) => {
    const response = await api.delete(`/favorites/${activityId}`);
    return response.data;
  }
};

// История просмотров
export const historyAPI = {
  // Получить историю просмотров
  getHistory: async () => {
    const response = await api.get('/history');
    console.log('📋 Ответ /history:', response.data);
    console.log('📋 Тип ответа:', typeof response.data);
    console.log('📋 Является ли массивом:', Array.isArray(response.data));
    
    // Проверяем, что ответ не null/undefined и является массивом
    let result = response.data;
    if (result === null || result === undefined) {
      console.log('⚠️ Ответ null/undefined, заменяем на пустой массив');
      result = [];
    } else if (!Array.isArray(result)) {
      console.log('⚠️ Ответ не является массивом, заменяем на пустой массив');
      result = [];
    }
    
    console.log('📋 Финальный результат истории:', result);
    return result;
  },

  // Добавить просмотр активности
  addToHistory: async (activityId) => {
    const response = await api.post(`/history/${activityId}`);
    return response.data;
  }
};

// Статистика настроения пользователя
export const usersAPI = {
  // Получить статистику настроения за N дней
  getMoodStats: async (days = 7) => {
    const response = await api.get(`/users/me/mood-stats?days=${days}`);
    return response.data;
  }
};

export default api; 