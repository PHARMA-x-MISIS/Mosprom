// app/(main)/community/[id].tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
// --- API ---
import { getCommunityById, getPosts } from 'api/api';
// --- Иконки ---
import { ArrowLeft, Check, Info, Gift } from 'lucide-react-native';
// --- Компоненты ---
import PostCard from 'components/PostCard';
import { CommunityRead, PostRead } from 'api/types';
import { getImageUrl } from 'api/utils';

export default function CommunityProfileScreen() {
  // 1. Получаем `id` из URL, например, '12' из '/community/12'
  const { id } = useLocalSearchParams();
  const communityId = Number(id);

  // --- Состояния компонента ---
  const [community, setCommunity] = useState<CommunityRead | null>(null);
  const [posts, setPosts] = useState<PostRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'events'>('feed');

  // --- Функция для загрузки всех данных (инфо + посты) ---
  const loadData = useCallback(async () => {
    if (!communityId) return;
    try {
      const [communityData, postsData] = await Promise.all([
        getCommunityById(communityId),
        getPosts({ community_id: communityId }) // Фильтруем посты по ID сообщества
      ]);
      setCommunity(communityData);
      setPosts(postsData);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные сообщества.');
      console.error(error);
    }
  }, [communityId]);

  // --- Эффекты ---
  // Первоначальная загрузка
  useEffect(() => {
    setIsLoading(true);
    loadData().finally(() => setIsLoading(false));
  }, [loadData]);

  // Ручное обновление
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  }, [loadData]);


  // --- Рендеринг ---

  // 1. Пока идет первая загрузка
  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#E94975" /></View>;
  }

  // 2. Если сообщество не найдено
  if (!community) {
    return <View style={styles.center}><Text>Сообщество не найдено.</Text></View>;
  }
  
  // Компонент-заглушка для пустой ленты
  const ListEmptyComponent = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Здесь пока нет записей</Text>
    </View>
  );

  // Компонент-шапка для FlatList, содержащий всю информацию о сообществе
  const ListHeaderComponent = (
    <>
      <View style={styles.infoContainer}>
        <Image 
          source={getImageUrl(community.avatar_url) ? { uri: getImageUrl(community.avatar_url)! } : require('assets/images/avatar-placeholder.png')}
          style={styles.avatar}
        />
        <Text style={styles.title}>{community.title}</Text>
        <View style={styles.statsRow}>
          <Check size={16} color="green" />
          <Text style={styles.statsText}>Вы участник · {community.member_count} подписчиков</Text>
        </View>
        <View style={styles.statsRow}>
          <Gift size={16} color="#E94975" />
          <Text style={styles.statsText}>У вас 14 очков сообщества · </Text>
          <TouchableOpacity onPress={() => router.push('/store')}><Text style={styles.linkText}>обменять</Text></TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <Info size={16} color="gray" />
          <Text style={styles.statsText}>Подробная информация</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}>
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>Лента сообщества</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}>
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>События</Text>
        </TouchableOpacity>
      </View>
      {/* Отступ перед постами */}
      <View style={{ height: 12 }} />
    </>
  );

  return (
    <View style={styles.container}>
      {/* Кастомная шапка с кнопкой "назад" */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      {/* Используем FlatList, чтобы скроллилась вся страница */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} hideSubscribeButton />}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={ListHeaderComponent} // Вся информация - это шапка списка
        ListEmptyComponent={!isRefreshing ? ListEmptyComponent : null}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

// --- Стили ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  header: { paddingTop: 50, paddingHorizontal: 8, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  infoContainer: { alignItems: 'center', padding: 16, backgroundColor: 'white' },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12, backgroundColor: '#e5e7eb' },
  title: { fontFamily: 'Onest-SemiBold', fontSize: 22, marginBottom: 8 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  statsText: { fontFamily: 'Onest-Regular', marginLeft: 8, color: '#6B7280', fontSize: 14 },
  linkText: { fontFamily: 'Onest-SemiBold', color: '#E94975', fontSize: 14 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 8, backgroundColor: 'white' },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#e5e7eb' },
  activeTab: { backgroundColor: '#d1d5db' },
  tabText: { fontFamily: 'Onest-Medium', color: '#374151' },
  activeTabText: { color: 'black' },
  emptyContainer: {
    padding: 50,
    alignItems: 'center',
  },
  emptyText: { 
    textAlign: 'center', 
    fontFamily: 'Onest-Regular', 
    color: 'gray',
    fontSize: 16,
  },
});