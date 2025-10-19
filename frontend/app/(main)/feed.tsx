// app/(main)/feed.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
// --- API ---
import { getPosts } from 'api/api';
// --- Компоненты ---
import PostCard from 'components/PostCard';
// --- Иконки ---
import { Plus } from 'lucide-react-native';
import { PostRead } from 'api/types';

export default function FeedScreen() {
  // --- Состояния компонента ---
  const [posts, setPosts] = useState<PostRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'events'>('feed');

  // --- Функция для загрузки данных ---
  const loadPosts = useCallback(async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Feed fetch error:", error);
      Alert.alert('Ошибка', 'Не удалось загрузить ленту.');
    }
  }, []);

  // --- Эффекты ---
  // Первоначальная загрузка при фокусе экрана
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadPosts().finally(() => setIsLoading(false));
    }, [loadPosts])
  );

  // Ручное обновление
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadPosts();
    setIsRefreshing(false);
  }, [loadPosts]);


  // --- Рендеринг ---

  // Компонент-заглушка для пустого списка
  const ListEmptyComponent = (
    <View style={styles.center}>
      <Text style={styles.emptyText}>Лента публикаций пуста</Text>
    </View>
  );

  // Пока идет первая загрузка, показываем центральный индикатор
  if (isLoading && posts.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#E94975" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Обертка нужна для абсолютного позиционирования FAB */}
      
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={item => item.id.toString()}
        // Отступ снизу, чтобы FAB не перекрывал последний пост
        contentContainerStyle={{ paddingBottom: 80 }} 
        // Шапка со вкладками теперь является частью списка
        ListHeaderComponent={
          <View style={styles.header}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
              onPress={() => setActiveTab('feed')}>
              <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>Лента публикаций</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'events' && styles.activeTab]}
              onPress={() => setActiveTab('events')}>
              <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>События</Text>
            </TouchableOpacity>
          </View>
        }
        // Компонент, если список пуст
        ListEmptyComponent={!isLoading ? ListEmptyComponent : null}
        // Функционал "Pull to Refresh"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />

      {/* --- Плавающая кнопка для создания поста --- */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/(post)/create')}
        activeOpacity={0.8}
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

// --- Стили ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f2f5' 
  },
  center: { 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: { 
    flexDirection: 'row', 
    padding: 16, 
    paddingTop: 60, 
    gap: 8, 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb',
    marginBottom: 8,
  },
  tab: { 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 8, 
    backgroundColor: '#f3f4f6' 
  },
  activeTab: { 
    backgroundColor: '#e5e7eb'
  },
  tabText: { 
    fontFamily: 'Onest-Medium', 
    color: '#374151' 
  },
  activeTabText: { 
    fontFamily: 'Onest-SemiBold',
    color: 'black' 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontFamily: 'Onest-Regular', 
    color: 'gray',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E94975',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});