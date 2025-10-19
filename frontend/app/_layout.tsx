// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, router, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';

// 1. Импортируем наш AuthProvider и хук useAuth
import { AuthProvider, useAuth } from 'src/lib/contexts/AuthContext';

// 2. Импортируем глобальные стили (Nativewind)
import '../global.css';

// 3. Предотвращаем автоматическое скрытие сплэш-скрина
SplashScreen.preventAutoHideAsync();

/**
 * Этот компонент отвечает за навигацию.
 * Он вызывается ПОСЛЕ загрузки шрифтов и ВНУТРИ AuthProvider,
 * поэтому имеет доступ к useAuth.
 */
function RootNavigation() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    // Ничего не делаем, пока AuthProvider проверяет токен
    if (isLoading) {
      return;
    }

    // Когда проверка завершена, решаем, куда направить пользователя
    if (token) {
      router.replace('/(main)/profile');
    } else {
      router.replace('/(auth)/onboarding');
    }
  }, [token, isLoading]);

  // Пока AuthContext проверяет токен, показываем индикатор загрузки.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Этот Stack будет рендерить либо (auth) layout, либо (main) layout
  return <Stack screenOptions={{ headerShown: false }} />;
}

/**
 * Это корневой Layout всего приложения.
 * Он отвечает за загрузку ресурсов и предоставление глобальных контекстов.
 */
export default function RootLayout() {
  // 4. Загружаем шрифты
  const [fontsLoaded, fontError] = useFonts({
    'Onest-Regular': require('../assets/fonts/Onest-Regular.ttf'),
    'Onest-Medium': require('../assets/fonts/Onest-Medium.ttf'),
    'Onest-SemiBold': require('../assets/fonts/Onest-SemiBold.ttf'),
    'Onest-ExtraBold': require('../assets/fonts/Onest-ExtraBold.ttf'),
  });

  // 5. Управляем видимостью сплэш-скрина
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Если шрифты еще не загружены (или есть ошибка), не рендерим ничего,
  // чтобы сплэш-скрин оставался видимым.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // 6. Рендерим структуру приложения со всеми провайдерами
  return (
    // AuthProvider оборачивает все, чтобы useAuth был доступен везде
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        {/* RootNavigation вызывается здесь, когда все ресурсы и контексты готовы */}
        <RootNavigation />
      </SafeAreaProvider>
    </AuthProvider>
  );
}