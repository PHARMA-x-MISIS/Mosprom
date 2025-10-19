// app/(auth)/register-step3.tsx
import React from 'react';
import { View, Text, TouchableOpacity, NativeSyntheticEvent, TextInputContentSizeChangeEventData } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import Button from 'components/Button';
import AuthLayout from 'layouts/AuthLayout';
import LabeledInput from 'components/LabeledInput';
import { z } from 'zod';
import { useRegistration } from '../../src/lib/contexts/RegistrationContext';

// Схема валидации для третьего шага (все поля опциональны)
const registrationStep3Schema = z.object({
  vkLink: z.string().optional(),
  studyPlace: z.string().optional(),
  workPlace: z.string().optional(),
  aboutYou: z.string().optional(),
});

// Тип данных формы, выведенный из схемы
type RegistrationStep3FormData = z.infer<typeof registrationStep3Schema>;

export default function RegisterStep3Screen() {
  // Получаем функцию для обновления данных из нашего контекста
  const { updateData } = useRegistration();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationStep3FormData>({
    resolver: zodResolver(registrationStep3Schema),
    defaultValues: {
      vkLink: '',
      studyPlace: '',
      workPlace: '',
      aboutYou: '',
    },
  });

  // Функция, которая вызывается при нажатии на кнопку "Далее"
  const onSubmit = (data: RegistrationStep3FormData) => {
    // Сохраняем данные в контекст с ключами, которые ожидает API
    updateData({
      contact: data.vkLink,
      place_of_study: data.studyPlace,
      place_of_job: data.workPlace,
      description: data.aboutYou,
    });
    // Переходим на экран загрузки
    router.push('/(auth)/register-step3-loading');
  };

  return (
    <AuthLayout
      title="Регистрация"
      subtitle="Контактные данные"
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
          name="vkLink"
          render={({ field: { onChange, onBlur, value } }) => (
            <LabeledInput
              label="Ссылка на ВК"
              placeholder="vk.me/"
              required={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.vkLink?.message}
              autoCapitalize="none"
              keyboardType="url"
            />
          )}
        />

        <Controller
          control={control}
          name="studyPlace"
          render={({ field: { onChange, onBlur, value } }) => (
            <LabeledInput
              label="Место учебы"
              placeholder="Место учебы"
              onBlur={onBlur}
              required={false}
              onChangeText={onChange}
              value={value}
              error={errors.studyPlace?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="workPlace"
          render={({ field: { onChange, onBlur, value } }) => (
            <LabeledInput
              label="Место работы"
              placeholder="Место работы"
              onBlur={onBlur}
              required={false}
              onChangeText={onChange}
              value={value}
              error={errors.workPlace?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="aboutYou"
          render={({ field: { onChange, onBlur, value } }) => {
            // Эта логика отвечает за динамическое изменение высоты поля
            const MIN_HEIGHT = 100;
            const MAX_HEIGHT = 300;
            const [height, setHeight] = React.useState<number>(MIN_HEIGHT);

            const handleContentSizeChange = React.useCallback(
              (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
                const newHeight = Math.ceil(e.nativeEvent.contentSize.height || 0);
                const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
                setHeight(clampedHeight);
              },
              []
            );
            
            return (
              <LabeledInput
                label="О вас"
                placeholder="Расскажите о себе"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.aboutYou?.message}
                multiline
                required={false}
                textAlignVertical="top"
                style={{ minHeight: MIN_HEIGHT, height: height }}
                scrollEnabled={height >= MAX_HEIGHT}
                onContentSizeChange={handleContentSizeChange}
              />
            );
          }}
        />

        <View className="mt-12 w-full px-5">
          <Button 
            title="Далее"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </AuthLayout>
  );
}