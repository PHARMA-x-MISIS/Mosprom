// app/(auth)/register-step2.tsx
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

const registrationStep2Schema = z.object({
  firstName: z.string().min(1, 'Введите имя'),
  lastName: z.string().min(1, 'Введите фамилию'),
  birthDate: z.string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Введите дату в формате дд.мм.гггг')
    .refine((date) => {
      const [day, month, year] = date.split('.').map(Number);
      const dateObj = new Date(year, month - 1, day);
      return (
        dateObj &&
        dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day
      );
    }, 'Введите корректную дату'),
});


type RegistrationStep2FormData = z.infer<typeof registrationStep2Schema>;

export default function RegisterStep2Screen() {
  const { updateData } = useRegistration();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationStep2FormData>({
    resolver: zodResolver(registrationStep2Schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
    },
  });


  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const birthDate = watch('birthDate');
  const isFormFilled = firstName.trim() !== '' && lastName.trim() !== '' && birthDate.trim() !== '';

  const formatBirthDate = (text: string) => {
    const cleaned = text.replace(/\D/g, ''); 
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4, 8)}`;
    }
  };

  const onSubmit = (data: RegistrationStep2FormData) => {
    updateData({
      first_name: data.firstName,
      last_name: data.lastName,
      birthDate: data.birthDate,
    });

    router.push('/(auth)/register-step3');
  };

  return (
    <AuthLayout
      title="Регистрация"
      subtitle="Первое знакомство"
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
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <LabeledInput
              label="Имя"
              required
              placeholder="Имя"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.firstName?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <LabeledInput
              label="Фамилия"
              required
              placeholder="Фамилия"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.lastName?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="birthDate"
          render={({ field: { onChange, onBlur, value } }) => (
            <LabeledInput
              label="Дата рождения"
              placeholder="дд.мм.гггг"
              onBlur={onBlur}
              onChangeText={(text) => {
                const formatted = formatBirthDate(text);
                onChange(formatted);
              }}
              value={value}
              error={errors.birthDate?.message}
              keyboardType="numeric"
              maxLength={10} 
              required
            />
          )}
        />

        <View className="mt-20 w-full px-5">
          <Button
            title="Далее"
            outline={!isFormFilled}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </AuthLayout>
  );
}