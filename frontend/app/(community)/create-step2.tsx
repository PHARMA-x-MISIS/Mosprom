// app/(community)/create-step2.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from 'components/Button';
import AuthLayout from 'layouts/AuthLayout';
// --- Импортируем хук для работы с контекстом ---
import { useCommunityCreation } from 'src/lib/contexts/CommunityContext';

const audienceOptions = ['school', 'student', 'graduate'] as const;
type AudienceOption = typeof audienceOptions[number];

const createCommunityStep2Schema = z.object({
  website: z.string().url('Введите корректный URL').or(z.literal('')),
  targetAudience: z.enum(audienceOptions, {
    errorMap: () => ({ message: 'Пожалуйста, выберите целевую аудиторию' }),
  }),
});

type CreateCommunityStep2FormData = z.infer<typeof createCommunityStep2Schema>;

const audienceLabels: Record<AudienceOption, string> = {
  school: 'Школьники',
  student: 'Студенты',
  graduate: 'Выпускники',
};

export default function CreateCommunityStep2Screen() {
  // --- Получаем функцию для обновления данных из контекста ---
  const { updateData } = useCommunityCreation();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateCommunityStep2FormData>({
    resolver: zodResolver(createCommunityStep2Schema),
    defaultValues: {
      website: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: CreateCommunityStep2FormData) => {
    // 1. Сохраняем данные в контекст
    updateData({ website: data.website, targetAudience: data.targetAudience });
    // 2. Переходим на экран загрузки
    router.push('/(community)/create-step2-loading');
  };

  return (
    <AuthLayout
      title="Создание сообщества"
      subtitle="Контакты"
      showBackButton
      footer={
        <View style={styles.footer}>
          <Button
            title="Далее"
            onPress={handleSubmit(onSubmit)}
            outline={!isValid}
          />
        </View>
      }>
      <View style={styles.container}>
        {/* --- Поле "Сайт организации" --- */}
        <Controller
          control={control}
          name="website"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Сайт организации</Text>
              <TextInput
                style={[styles.textInput, errors.website && styles.inputError]}
                placeholder="https://"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="url"
                autoCapitalize="none"
              />
              {errors.website && (
                <Text style={styles.errorText}>{errors.website.message}</Text>
              )}
            </View>
          )}
        />

        {/* --- Группа радио-кнопок --- */}
        <Controller
          control={control}
          name="targetAudience"
          render={({ field: { onChange, value: selectedValue } }) => (
            <View>
              <Text style={styles.label}>Для кого организация</Text>
              <View style={{ gap: 12 }}>
                {audienceOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    onPress={() => onChange(option)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.radioCircle, selectedValue === option && styles.radioCircleSelected]}>
                      {selectedValue === option && (
                        <View style={styles.radioDot} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>{audienceLabels[option]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.targetAudience && (
                <Text style={[styles.errorText, { marginTop: 8 }]}>{errors.targetAudience.message}</Text>
              )}
            </View>
          )}
        />
      </View>
    </AuthLayout>
  );
}

// --- Стили ---
const styles = StyleSheet.create({
  footer: { paddingHorizontal: 20 },
  container: { paddingHorizontal: 20 },
  inputContainer: { marginBottom: 32 },
  label: { fontFamily: 'Onest-SemiBold', fontSize: 16, color: '#111827', marginBottom: 12 },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Onest-Regular',
    fontSize: 16,
    borderColor: '#D1D5DB',
  },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', marginTop: 4, fontSize: 14 },
  radioOption: { flexDirection: 'row', alignItems: 'center' },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: { borderColor: '#E94975' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E94975' },
  radioLabel: { marginLeft: 12, fontFamily: 'Onest-Regular', fontSize: 16, color: '#111827' },
});