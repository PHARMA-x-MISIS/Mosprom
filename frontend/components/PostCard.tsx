// components/PostCard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import {
  likePost,
  unlikePost,
  getCommunityById,
  getUserById,
  joinCommunity,
} from 'api/api';
// Для иконок: npx expo install lucide-react-native
import { Heart, MessageSquare, PlusCircle } from 'lucide-react-native';
import { PostRead } from 'api/types';
import { getImageUrl } from 'api/utils';

// Тип для хранения унифицированной информации об авторе
interface AuthorInfo {
  name: string;
  avatarUrl?: string | null;
  details: string;
}

// Утилитарная функция для форматирования даты
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

// Утилитарная функция для форматирования чисел (1234 -> 1.2k)
const formatCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};


export default function PostCard({ post, hideSubscribeButton = false }: { post: PostRead; hideSubscribeButton?: boolean }) {
  // --- Состояния компонента ---
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [authorInfo, setAuthorInfo] = useState<AuthorInfo | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // --- Эффект для загрузки данных об авторе ---
  useEffect(() => {
    // Если есть community_id, значит автор - сообщество
    if (post.community_id) {
      getCommunityById(post.community_id)
        .then(community => {
          setAuthorInfo({
            name: community.title,
            avatarUrl: getImageUrl(community.avatar_url),
            details: `${community.skills.slice(0, 1).join(', ')} · ${community.member_count} подписчиков`,
          });
        })
        .catch(() => setAuthorInfo({ name: 'Неизвестное сообщество', details: '' }));
    } else {
      // Иначе, автор - пользователь
      getUserById(post.author_id)
        .then(user => {
          setAuthorInfo({
            name: `${user.first_name} ${user.last_name}`,
            avatarUrl: getImageUrl(user.profile_photo),
            details: formatDate(post.created_at),
          });
        })
        .catch(() => setAuthorInfo({ name: 'Неизвестный пользователь', details: '' }));
    }
  }, [post.community_id, post.author_id]);

  // --- Обработчик лайка с оптимистичным обновлением ---
  const handleLike = async () => {
    const originalLiked = isLiked;
    const originalCount = likeCount;
    setIsLiked(!originalLiked);
    setLikeCount(originalLiked ? originalCount - 1 : originalCount + 1);
    try {
      const apiCall = originalLiked ? unlikePost : likePost;
      const response = await apiCall(post.id);
      setIsLiked(response.liked);
      setLikeCount(response.like_count);
    } catch (error) {
      setIsLiked(originalLiked);
      setLikeCount(originalCount);
      console.error('Ошибка лайка/анлайка:', error);
    }
  };
  
  // --- Обработчик перехода на страницу автора ---
  const handleHeaderPress = () => {
    if (post.community_id) {
      router.push(`/(main)/community/${post.community_id}`);
    }
    // TODO: Добавить переход на профиль пользователя
  };

  // --- Обработчик подписки на сообщество ---
  const handleSubscribe = async () => {
    if (!post.community_id) return;
    setIsSubscribing(true);
    try {
      await joinCommunity(post.community_id);
      Alert.alert('Успех!', `Вы подписались на сообщество "${authorInfo?.name || ''}".`);
      // TODO: Обновить UI, чтобы скрыть кнопку
    } catch (error) {
      Alert.alert('Ошибка', (error as Error).message);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Не рендерим ничего, пока информация об авторе не загружена
  if (!authorInfo) {
    return null;
  }

  return (
    <View style={styles.card}>
      {/* --- Шапка поста (кликабельная) --- */}
      <TouchableOpacity onPress={handleHeaderPress} activeOpacity={0.8}>
        <View style={styles.header}>
          <Image 
            source={authorInfo.avatarUrl ? { uri: authorInfo.avatarUrl } : require('assets/images/avatar-placeholder.png')}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.authorName}>{authorInfo.name}</Text>
            <Text style={styles.authorDetails}>{authorInfo.details}</Text>
          </View>
          {post.community_id && !hideSubscribeButton && (
            <TouchableOpacity onPress={handleSubscribe} disabled={isSubscribing} style={styles.subscribeButton}>
              <PlusCircle size={28} color="#E94975" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* --- Текст поста --- */}
      <Text style={styles.content}>{post.text}</Text>

      {/* --- Футер поста (лайки, комменты и кнопка) --- */}
      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton} activeOpacity={1}>
            <Heart size={22} color={isLiked ? '#E94975' : '#9CA3AF'} fill={isLiked ? '#E94975' : 'none'} />
            <Text style={[styles.actionText, isLiked && styles.actionTextLiked]}>
              {formatCount(likeCount)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={1}>
            <MessageSquare size={22} color="#9CA3AF" />
            <Text style={styles.actionText}>{formatCount(post.comment_count)}</Text>
          </TouchableOpacity>
        </View>
        
        {/* TODO: Добавить логику для кнопки "К событию" */}
      </View>
    </View>
  );
}

// --- Стили ---
const styles = StyleSheet.create({
  card: { 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12, 
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  avatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    marginRight: 12,
    backgroundColor: '#f0f2f5',
  },
  headerText: { 
    flex: 1 
  },
  authorName: { 
    fontFamily: 'Onest-SemiBold', 
    fontSize: 18 
  },
  authorDetails: { 
    fontFamily: 'Onest-Regular', 
    fontSize: 13, 
    color: '#6B7280' 
  },
  subscribeButton: { 
    padding: 4 
  },
  content: { 
    fontFamily: 'Onest-Regular', 
    fontSize: 16, 
    lineHeight: 24, 
    marginBottom: 16 
  },
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  actions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16 
  },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f3f4f6', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 16 
  },
  actionText: { 
    fontFamily: 'Onest-Medium', 
    marginLeft: 6, 
    color: '#6B7280',
    fontSize: 14,
  },
  actionTextLiked: {
    color: '#E94975',
  },
});