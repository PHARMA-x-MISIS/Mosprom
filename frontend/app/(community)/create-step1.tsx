// app/(community)/create-step1.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from 'components/Button';
import AuthLayout from 'layouts/AuthLayout';
// --- Импортируем хук для работы с контекстом ---
import { useCommunityCreation } from 'src/lib/contexts/CommunityContext';

// Схема валидации Zod
const createCommunityStep1Schema = z.object({
  name: z.string().min(1, 'Название не может быть пустым'),
  description: z.string().optional(), // Описание может быть пустым
});

// Тип данных формы
type CreateCommunityStep1FormData = z.infer<typeof createCommunityStep1Schema>;

export default function CreateCommunityStep1Screen() {
  // --- Получаем функцию для обновления данных из контекста ---
  const { updateData } = useCommunityCreation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateCommunityStep1FormData>({
    resolver: zodResolver(createCommunityStep1Schema),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onChange', 
  });

  const onSubmit = (data: CreateCommunityStep1FormData) => {
    // 1. Сохраняем данные в контекст
    updateData({ title: data.name, description: data.description });
    // 2. Переходим на следующий шаг по правильному пути
    router.push('/(community)/create-step2');
  };

  return (
    <AuthLayout
      title="Создание сообщества"
      subtitle="Первое знакомство"
      showBackButton
      footer={
        <View style={styles.footer}>
          <Button
            title="Далее"
            onPress={handleSubmit(onSubmit)}
            outline={!isValid} // Кнопка активна, только если форма валидна
          />
        </View>
      }>
      <View style={styles.container}>
        {/* --- Поле "Название" --- */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Название <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, errors.name && styles.inputError]}
                placeholder="Введите название"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.name && (
                <Text style={styles.errorText}>
                  {errors.name.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* --- Поле "Описание" --- */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Описание
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Расскажите о сообществе"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                textAlignVertical="top"
              />
            </View>
          )}
        />
        
        <Text style={styles.hintText}>
          Используйте слова, которые описывают тематику сообщества и помогают быстрее его найти. Изменить описание можно в любой момент.
        </Text>
      </View>
    </AuthLayout>
  );
}

// --- Стили ---
const styles = StyleSheet.create({
  footer: { marginBottom: 20, paddingHorizontal: 20 },
  container: { paddingHorizontal: 20 },
  inputContainer: { marginBottom: 24 },
  label: { fontFamily: 'Onest-SemiBold', fontSize: 16, color: '#111827', marginBottom: 8 },
  requiredStar: { color: '#EF4444' },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Onest-Regular',
    fontSize: 16,
    borderColor: '#D1D5DB',
  },
  textArea: { height: 112 },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', marginTop: 4, fontSize: 14 },
  hintText: { fontFamily: 'Onest-Regular', fontSize: 14, color: '#6B7280' },
});