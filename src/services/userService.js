// Сервис для работы с пользователями
export const userService = {
  // Получить информацию о текущем пользователе
  getCurrentUser: () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    
    try {
      // Декодируем JWT токен (базовая реализация)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.user_id,
        username: payload.username,
        role: payload.role || 'user'
      };
    } catch (error) {
      console.error('Ошибка декодирования токена:', error);
      return null;
    }
  },

  // Проверить, является ли пользователь админом
  isAdmin: () => {
    const user = userService.getCurrentUser();
    return user && user.role === 'admin';
  },

  // Проверить, является ли пользователь модератором или админом
  isModerator: () => {
    const user = userService.getCurrentUser();
    return user && (user.role === 'admin' || user.role === 'moderator');
  },

  // Получить роль пользователя
  getUserRole: () => {
    const user = userService.getCurrentUser();
    return user ? user.role : null;
  }
}; 