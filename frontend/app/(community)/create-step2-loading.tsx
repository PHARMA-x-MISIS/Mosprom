// app/(community)/create-step2-loading.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

export default function CreateCommunityStep2LoadingScreen() {
  useEffect(() => {
    // Показываем экран загрузки 2.5 секунды, затем переходим на шаг 3
    const timer = setTimeout(() => {
      router.replace('/(community)/create-step3');
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
        Подбираем тематику...
      </Text>
    </View>
  );
}

