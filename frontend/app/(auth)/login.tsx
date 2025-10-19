import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import Button from 'components/Button';
import AuthLayout from 'layouts/AuthLayout';
import LabeledInput from 'components/LabeledInput';
import { loginSchema, LoginFormData } from 'src/lib/validation/authSchemas';
import { useAuth } from '../../src/lib/contexts/AuthContext'; // Импортируем наш хук

export default function LoginScreen() {
  // Получаем функцию signIn из глобального контекста
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false); // Состояние для отслеживания загрузки

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const email = watch('email');
  const password = watch('password');
  const isFormFilled = email.trim() !== '' && password.trim() !== '';

  // Обновленная функция onSubmit
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      // Просто вызываем signIn, он сделает всю работу
      await signIn(data);
      // Навигация произойдет автоматически благодаря _layout.tsx,
      // но для мгновенного эффекта можно оставить router.replace
      router.replace('/(main)/profile');
    } catch (error) {
      Alert.alert('Ошибка входа', (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Вход"
      subtitle="развивай свои компетенции вместе с предприятиями"
      footer={
        <View className="items-center">
          <Text className="text-gray-600 font-onest-regular">Ещё нет аккаунта?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="mt-1 text-blue-600 font-onest-semibold">Зарегистрироваться</Text>
          </TouchableOpacity>
        </View>
      }>
      <View className="gap-y-2">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <LabeledInput
              label="Почта"
              placeholder="example@mail.com"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none" 
              required={false}            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <LabeledInput
              label="Пароль"
              placeholder="Введите пароль"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
              secureTextEntry required={false}            />
          )}
        />
        <View className="mt-12 w-full gap-y-4 px-5">
          <Button 
            title={isSubmitting ? "Вход..." : "Войти"}
            outline={!isFormFilled}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting || !isFormFilled} // Блокируем кнопку
          />
          <Button title="Войти" social="gos" disabled={isSubmitting} />
          <Button title="Войти" social="vk" disabled={isSubmitting} />
        </View>
      </View>
    </AuthLayout>
  );
}