// app/(auth)/onboarding.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Button from 'components/Button';
import { CheckIcon } from 'components/icons';

export default function OnboardingScreen() {
  return (
    <View className="flex-1 bg-white">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-5 pt-[92px] pb-12">
          {/* Header */}
          <View className="items-center mb-12">
            <Text className="text-3xl font-onest-semibold text-gray-900 mb-3">
              Привет
            </Text>
            <Text className="text-center text-gray-600 font-onest-regular px-4">
              развивай свои компетенции вместе с предприятиями
            </Text>
          </View>

          {/* Features List */}
          <View className="gap-y-6 mb-auto flex">
            {/* Feature 1 */}
            <View className="flex-row gap-x-3">
              <View className="items-center justify-center" style={{ height: 28 }}>
                <CheckIcon width={24} height={24} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-onest-semibold text-gray-900 mb-1">
                  Будьте собой
                </Text>
                <Text className="text-gray-600 font-onest-regular leading-5">
                  Убедитесь что ваше описание, навыки и достижения соответствуют вам.
                </Text>
              </View>
            </View>

            {/* Feature 2 */}
            <View className="flex-row gap-x-3">
              <View className="items-center justify-center" style={{ height: 28 }}>
                <CheckIcon width={24} height={24} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-onest-semibold text-gray-900 mb-1">
                  Развивайтесь
                </Text>
                <Text className="text-gray-600 font-onest-regular leading-5">
                  Исследуй новое и улучшай свои компетенции вместе с сообществами
                </Text>
              </View>
            </View>

            {/* Feature 3 */}
            <View className="flex-row gap-x-3">
              <View className="items-center justify-center" style={{ height: 28 }}>
                <CheckIcon width={24} height={24} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-onest-semibold text-gray-900 mb-1">
                  Будьте активны
                </Text>
                <Text className="text-gray-600 font-onest-regular leading-5">
                  Вступайте в сообщества и будьте ближе к компаниям
                </Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View className="gap-y-3 mt-10">
            <Button 
              title="Войти" 
              onPress={() => router.push('/(auth)/login')}
            />
            <Button 
              title="Регистрация" 
              outline
              onPress={() => router.push('/(auth)/register')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}