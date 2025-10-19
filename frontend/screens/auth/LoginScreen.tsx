// src/screens/auth/LoginScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from 'components/Button';
import AuthLayout from '../../layouts/AuthLayout';
import LabeledInput from '../../components/LabeledInput';
import { loginSchema, LoginFormData } from '../../src/lib/validation/authSchemas';

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Отслеживаем заполненность полей
  const email = watch('email');
  const password = watch('password');
  const isFormFilled = email.trim() !== '' && password.trim() !== '';

  const onSubmit = (data: LoginFormData) => {
    console.log('Данные для входа:', data);
  };

  return (
    <AuthLayout
      title="Вход"
      subtitle="развивай свои компетенции вместе с предприятиями"
      footer={
        <View className="items-center">
          <Text className="text-gray-600 font-onest-regular">Ещё нет аккаунта?</Text>
          <TouchableOpacity>
            <Text className="mt-1 text-blue-600 font-onest-semibold">Зарегистрироваться</Text>
          </TouchableOpacity>
        </View>
      }>
      <View className="gap-y-5">
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
              autoCapitalize="none" required={false}            />
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

        <View className="mt-10 w-full gap-y-4 px-5">
          <Button 
            title="Войти" 
            outline={!isFormFilled}
            onPress={handleSubmit(onSubmit)}
          />
          <Button title="Войти" social="gos" />
          <Button title="Войти" social="vk" />
        </View>
      </View>
    </AuthLayout>
  );
};

export default LoginScreen;