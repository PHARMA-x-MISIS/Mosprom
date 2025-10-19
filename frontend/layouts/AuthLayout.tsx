// layouts/AuthLayout.tsx
import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LeftArrow } from 'components/icons';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showBackButton?: boolean;
  disableScroll?: boolean; // Наше новое свойство
}

// Этот компонент содержит всю разметку, чтобы избежать дублирования
const LayoutContent = ({ title, subtitle, showBackButton, children, footer }: Omit<AuthLayoutProps, 'disableScroll'>) => (
  <View className="flex-1 px-4 pt-9 justify-between">
    <View className="flex-1">
      {showBackButton && (
        <TouchableOpacity 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <LeftArrow />
        </TouchableOpacity>
      )}

      <View className="mt-4 mb-8 items-center">
        <View className="w-[85%]">
          <Text className="font-onest-semibold text-3xl text-center mb-3 text-black">
            {title}
          </Text>
          {subtitle && (
            <Text className="font-onest-regular text-base text-center text-gray-500">
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Обертка для children, чтобы FlatList мог правильно растянуться */}
      <View className="flex-1">
        {children}
      </View>
    </View>

    {footer && (
      <View className="mt-8 mb-6">
        {footer}
      </View>
    )}
  </View>
);


const AuthLayout = (props: AuthLayoutProps) => {
  const { disableScroll = false } = props;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {disableScroll ? (
            // Версия БЕЗ ScrollView для экранов со списками
            <LayoutContent {...props} />
          ) : (
            // Версия С ScrollView для обычных экранов
            <ScrollView 
              className="flex-1" 
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <LayoutContent {...props} />
            </ScrollView>
          )}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthLayout;