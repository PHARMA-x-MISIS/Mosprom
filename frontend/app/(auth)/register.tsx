// app/(auth)/register.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import Button from 'components/Button';
import AuthLayout from 'layouts/AuthLayout';
import LabeledInput from 'components/LabeledInput';
import { z } from 'zod';
import { useRegistration } from '../../src/lib/contexts/RegistrationContext'; 

const registrationStep1Schema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type RegistrationStep1FormData = z.infer<typeof registrationStep1Schema>;

export default function RegisterScreen() {
  const { updateData } = useRegistration(); 

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationStep1FormData>({
    resolver: zodResolver(registrationStep1Schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const email = watch('email');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const isFormFilled = email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '';

  const onSubmit = (data: RegistrationStep1FormData) => {
    updateData({ email: data.email, password: data.password });
    router.push('/(auth)/register-step2');
  };

  return (
    <AuthLayout
      title="Регистрация"
      subtitle="создание учетной записи"
      showBackButton
      footer={
        <View className="items-center">
          <Text className="text-gray-600 font-onest-regular">Уже есть аккаунт?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="mt-1 text-blue-600 font-onest-semibold">Войти</Text>
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
              placeholder="mail"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              required={true}
            />
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
              secureTextEntry
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <LabeledInput
              label="Повторите пароль"
              placeholder="Введите пароль"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.confirmPassword?.message}
              secureTextEntry
              required={true}
            />
          )}
        />
        <View className="mt-12 w-full gap-y-4 px-5">
          <Button 
            title="Далее" 
            outline={!isFormFilled}
            onPress={handleSubmit(onSubmit)}
          />
          <Button title="Войти" social="vk" />
          <Button title="Войти" social="gos" />
        </View>
      </View>
    </AuthLayout>
  );
}