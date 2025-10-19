// app/(community)/create-step4.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from 'components/Button';
import AuthLayout from 'layouts/AuthLayout';
import EntityListItem from 'components/EntityListItem';
import { Lupa, Plus, CheckIcon } from 'components/icons';
// --- API и Контекст ---
import { useCommunityCreation } from 'src/lib/contexts/CommunityContext';
import { getUsers } from 'api/api';
import { UserRead } from 'api/types';
import { getImageUrl } from 'api/utils';

// Тип для удобного рендеринга в списке
interface UserForList {
  id: string;
  name: string;
  description: string;
  avatarUrl: string | null;
}

// Схема валидации Zod
const schema = z.object({
  mentors: z.array(z.string()).min(1, "Выберите хотя бы одного участника"),
});

type FormData = z.infer<typeof schema>;

export default function CreateCommunityStep4Screen() {
  const { updateData } = useCommunityCreation();
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<UserForList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { setValue, watch, handleSubmit, formState: { isValid } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { mentors: [] },
    mode: 'onChange',
  });

  const selectedMentors = watch('mentors');

  // Загрузка пользователей с сервера
  useEffect(() => {
    getUsers()
      .then(usersFromServer => {
        // Преобразуем данные из API в формат, удобный для списка
        const formatted = usersFromServer.map((user: UserRead) => ({
          id: String(user.id),
          name: `${user.first_name} ${user.last_name}`,
          description: user.email,
          // Важно: преобразуем undefined/пустую строку в null и формируем полный URL
          avatarUrl: getImageUrl(user.profile_photo),
        }));
        setAllUsers(formatted);
      })
      .catch(error => Alert.alert('Ошибка', 'Не удалось загрузить список пользователей.'))
      .finally(() => setIsLoading(false));
  }, []);


  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return allUsers;
    return allUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, allUsers]);

  const toggleMentor = (id: string) => {
    const current = watch('mentors');
    const newSelection = current.includes(id)
      ? current.filter(item => item !== id)
      : [...current, id];
    setValue('mentors', newSelection, { shouldValidate: true });
  };

  const onSubmit = (data: FormData) => {
    // Преобразуем массив строк (ID) в массив чисел для API
    const mentorIdsAsNumbers = data.mentors.map(Number);
    // Сохраняем в контекст
    updateData({ moderator_ids: mentorIdsAsNumbers });
    router.push('/(community)/create-step5');
  };

  return (
    <AuthLayout
      title="Добавить менторов"
      subtitle="Выберите менторов от организации для этого сообщества" 
      showBackButton
      disableScroll
      footer={
        <View style={styles.footer}>
          <Button 
            title="Далее" 
            onPress={handleSubmit(onSubmit)} 
            outline={!isValid} 
            disabled={isLoading}
          />
        </View>
      }>
        <FlatList
            ListHeaderComponent={ 
                <View style={styles.searchContainer}>
                    <Lupa width={20} height={20} color="#6B7280" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Поиск по имени"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholderTextColor="#9CA3AF"
                    />
                </View>
            }
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                const isSelected = selectedMentors.includes(item.id);
                return (
                    <EntityListItem
                      title={item.name}
                      subtitle={item.description}
                      imageUrl={item.avatarUrl} // EntityListItem теперь умеет обрабатывать null
                      onActionPress={() => toggleMentor(item.id)}
                      ActionIcon={isSelected ? CheckIcon : Plus}
                    />
                );
            }}
            ListEmptyComponent={
              isLoading ? <ActivityIndicator size="large" color="#E94975" /> : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Ничего не найдено</Text>
                </View>
              )
            }
            contentContainerStyle={{ paddingHorizontal: 20, flexGrow: 1 }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    </AuthLayout>
  );
}

// --- Стили ---
const styles = StyleSheet.create({
  footer: { 
    marginBottom: 20, 
    paddingHorizontal: 20 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Onest-Regular',
    fontSize: 16,
    height: 48,
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: 40 
  },
  emptyText: { 
    color: '#9CA3AF', 
    fontFamily: 'Onest-Regular' 
  },
  separator: { 
    height: 1, 
    backgroundColor: '#e5e7eb', 
    marginLeft: 76 // Отступ слева, чтобы линия не затрагивала аватар
  },
});