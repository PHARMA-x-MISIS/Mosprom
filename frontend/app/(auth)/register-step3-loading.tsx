// app/(auth)/register-step3-loading.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

export default function RegisterStep3LoadingScreen() {
  useEffect(() => {
    // Показываем экран загрузки 2.5 секунды, затем переходим на шаг 4
    const timer = setTimeout(() => {
      router.replace('/(auth)/register-step4');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      <ActivityIndicator size="large" color="#E94975" />
      <Text 
        style={{ fontFamily: 'Onest-Medium' }}
        className="text-xl text-gray-800 mt-6 text-center"
      >
        Подбираем ваши интересы...
      </Text>
    </View>
  );
}

