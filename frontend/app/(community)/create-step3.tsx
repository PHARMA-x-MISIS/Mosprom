// app/(community)/create-step3.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from 'components/Button';
import AuthLayout from 'layouts/AuthLayout';
import { Lupa } from 'components/icons';
// --- API и Контекст ---
import { useCommunityCreation } from 'src/lib/contexts/CommunityContext';
import { getAllSkills } from 'api/api';

// Тип для удобного рендеринга
type PillColorType = 'orange' | 'blue' | 'yellow' | 'green' | 'lightgreen';
interface Competency {
  id: string; // В нашем случае id и name будут одинаковыми - это сам skill
  name: string;
  color: PillColorType;
}

const colors: PillColorType[] = ['orange', 'lightgreen', 'yellow', 'blue', 'green'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// Схема валидации Zod
const schema = z.object({
  competencies: z.array(z.string()).min(3, "Выберите минимум 3 компетенции"),
});

type FormData = z.infer<typeof schema>;

export default function CreateCommunityStep3Screen() {
  const { updateData } = useCommunityCreation();
  const [searchQuery, setSearchQuery] = useState('');
  const [allCompetencies, setAllCompetencies] = useState<Competency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { control, handleSubmit, setValue, watch, formState: { isValid } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { competencies: [] },
    mode: 'onChange',
  });

  const selectedCompetencies = watch('competencies');

  // Загрузка компетенций с сервера
  useEffect(() => {
    getAllSkills()
      .then(skillsFromServer => {
        const formatted = skillsFromServer.map(skill => ({
          id: skill,
          name: skill,
          color: getRandomColor(),
        }));
        setAllCompetencies(formatted);
        
        // Автоматически выбираем три компетенции
        const defaultSkills = ['devops', 'контейнеризация', 'фронтенд'];
        const selectedDefaults = formatted
          .filter(skill => defaultSkills.includes(skill.name.toLowerCase()))
          .map(skill => skill.name);
        
        if (selectedDefaults.length > 0) {
          setValue('competencies', selectedDefaults, { shouldValidate: true });
        }
      })
      .catch(error => Alert.alert('Ошибка', 'Не удалось загрузить список компетенций.'))
      .finally(() => setIsLoading(false));
  }, [setValue]);

  const filteredCompetencies = useMemo(() => {
    if (!searchQuery.trim()) return allCompetencies;
    return allCompetencies.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, allCompetencies]);

  const toggleCompetency = (name: string) => {
    const current = watch('competencies');
    const newSelection = current.includes(name)
      ? current.filter(item => item !== name)
      : [...current, name];
    setValue('competencies', newSelection, { shouldValidate: true });
  };

  const onSubmit = (data: FormData) => {
    updateData({ skills: data.competencies });
    router.push('/(community)/create-step4');
  };

  return (
    <AuthLayout
      title="Тематика"
      subtitle="Выберите ключевые компетенции, которые развивает это сообщество"
      showBackButton
      disableScroll // Отключаем скролл в лэйауте, так как у нас есть свой
      footer={
        <View style={styles.footer}>
          <Button
            title={isValid ? "Далее" : `Далее (${selectedCompetencies.length}/3)`}
            outline={!isValid}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          />
        </View>
      }>
      <View style={styles.container}>
        {/* Поиск */}
        <View style={styles.searchContainer}>
          <Lupa width={20} height={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Список компетенций */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#E94975" />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.pillsContainer}>
              {filteredCompetencies.map(comp => {
                const isSelected = selectedCompetencies.includes(comp.name);
                // Определяем более тусклый цвет для каждой пилюли
                const getPillColor = () => {
                  switch (comp.color) {
                    case 'orange': return '#FFE4CC';
                    case 'blue': return '#D6DAFF';
                    case 'yellow': return '#FFFACC';
                    case 'green': return '#CCF5E8';
                    case 'lightgreen': return '#DFFFEA';
                    default: return '#E5E7EB';
                  }
                };
                
                return (
                  <TouchableOpacity
                    key={comp.id}
                    onPress={() => toggleCompetency(comp.name)}
                    activeOpacity={0.8}
                    style={[styles.pill, isSelected && { backgroundColor: getPillColor() }]}
                  >
                    <Text style={[styles.pillText, isSelected && { color: '#1F2937' }]}>
                      {comp.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {filteredCompetencies.length === 0 && (
              <Text style={styles.emptyText}>Ничего не найдено</Text>
            )}
          </ScrollView>
        )}
      </View>
    </AuthLayout>
  );
}

// --- Стили ---
const styles = StyleSheet.create({
  footer: { paddingHorizontal: 20 },
  container: { paddingHorizontal: 20, flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Onest-Regular',
    fontSize: 16,
    height: 48,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pillText: {
    fontFamily: 'Onest-SemiBold',
    fontSize: 15,
    color: '#374151',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Onest-Regular',
    color: '#9CA3AF',
  },
});