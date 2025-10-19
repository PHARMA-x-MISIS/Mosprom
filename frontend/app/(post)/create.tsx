// app/(post)/create.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import Button from 'components/Button';
// --- API ---
import { createPost, getMyCommunities } from 'api/api';
import { PostCreate, CommunityRead } from 'api/types';

export default function CreatePostScreen() {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [myCommunities, setMyCommunities] = useState<CommunityRead[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(true);

  useEffect(() => {
    getMyCommunities()
      .then(setMyCommunities)
      .catch((error) => {
        console.error("Failed to fetch user's communities:", error);
      })
      .finally(() => setIsLoadingCommunities(false));
  }, []);

  // --- ОБНОВЛЕННЫЙ ОБРАБОТЧИК ---
  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert('Ошибка', 'Текст поста не может быть пустым.');
      return;
    }
    setIsSubmitting(true);
    try {
      // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
      const postData: PostCreate = {
        text,
        // Теперь мы используем динамическое значение из состояния
        community_id: selectedCommunityId ?? undefined,
      };

      const newPost = await createPost(postData);
      console.log('Пост создан:', newPost);
      
      Alert.alert('Успех!', 'Ваш пост успешно опубликован.');
      router.back();

    } catch (error) {
      Alert.alert('Ошибка публикации', (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <Text style={styles.title}>Новый пост</Text>
      </View>

      {/* Выбор автора (сообщества или личный) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Опубликовать от имени:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.pillsContainer}>
            {/* Кнопка "От своего имени" */}
            <TouchableOpacity 
              onPress={() => setSelectedCommunityId(null)}
              style={[styles.pill, !selectedCommunityId && styles.pillSelected]}
            >
              <Text style={[styles.pillText, !selectedCommunityId && styles.pillTextSelected]}>
                От себя
              </Text>
            </TouchableOpacity>

            {/* Кнопки для каждого сообщества */}
            {isLoadingCommunities ? (
              <Text style={styles.loadingText}>Загрузка сообществ...</Text>
            ) : (
              myCommunities.map(community => (
                <TouchableOpacity 
                  key={community.id}
                  onPress={() => setSelectedCommunityId(community.id)}
                  style={[styles.pill, selectedCommunityId === community.id && styles.pillSelected]}
                >
                  <Text style={[styles.pillText, selectedCommunityId === community.id && styles.pillTextSelected]}>
                    {community.title}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* Поле ввода текста */}
      <TextInput
        style={styles.textInput}
        placeholder="Что у вас нового?"
        placeholderTextColor="#9CA3AF"
        value={text}
        onChangeText={setText}
        multiline
        textAlignVertical="top"
      />

      {/* Кнопки действий */}
      <View style={styles.footer}>
        <Button
          title={isSubmitting ? 'Публикация...' : 'Опубликовать'}
          onPress={handleSubmit}
          disabled={isSubmitting || !text.trim()}
          outline={!text.trim()}
        />
        <View style={{ height: 12 }} />
        <Button
          title="Отмена"
          onPress={() => router.back()}
          outline
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
}

// --- Стили ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Onest-SemiBold',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Onest-Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  pillSelected: {
    backgroundColor: '#E94975',
    borderColor: '#E94975',
  },
  pillText: {
    fontFamily: 'Onest-Medium',
    color: '#374151',
  },
  pillTextSelected: {
    color: 'white',
  },
  loadingText: {
    fontFamily: 'Onest-Regular',
    color: '#9CA3AF',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    height: 200,
    fontFamily: 'Onest-Regular',
    fontSize: 16,
  },
  footer: {
    marginTop: 'auto',
  },
});