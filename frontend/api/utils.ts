// api/utils.ts
// Утилиты для работы с API

const BASE_URL = 'https://mosprom.misis-team.ru';

/**
 * Формирует полный URL для изображения с сервера
 * @param relativePath - относительный путь, например "/uploads/profiles/..."
 * @returns полный URL или null, если путь не указан
 */
export const getImageUrl = (relativePath?: string | null): string | null => {
  if (!relativePath) return null;
  
  // Если путь уже полный (начинается с http), возвращаем как есть
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Убираем начальный слэш, если он есть, чтобы избежать двойного слэша
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  return `${BASE_URL}/${cleanPath}`;
};

