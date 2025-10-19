// components/CommunityLink.tsx (Обновленная версия)
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
// --- Импортируем тип CommunityRead ---
import { CommunityRead } from 'api/types';
import { getImageUrl } from 'api/utils';

// --- Компонент теперь принимает один пропс 'community' ---
interface CommunityLinkProps {
  community: CommunityRead;
}

const CommunityLink = ({ community }: CommunityLinkProps) => {
  // Обработчик нажатия теперь внутри, он использует ID из пропса
  const handlePress = () => {
    router.push(`/main/community/${community.id}`);
  };

  const avatarUrl = getImageUrl(community.avatar_url);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image 
        // Используем avatar_url, если он есть, иначе - заглушку
        source={avatarUrl ? { uri: avatarUrl } : require('assets/images/avatar-placeholder.png')}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{community.title}</Text>
        <Text style={styles.subtitle}>{community.member_count} подписчиков</Text>
      </View>
      {/* 
        Иконку стрелки можно добавить, если нужно по дизайну. 
        В предыдущей версии ее не было, но я добавлю ее сюда на всякий случай.
        import { ChevronRight } from 'lucide-react-native';
      */}
      {/* <ChevronRight size={20} color="#9CA3AF" /> */}
    </TouchableOpacity>
  );
};

// Используем StyleSheet для лучшей производительности и читаемости
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F9FAFB', // bg-gray-50
    borderRadius: 12, // rounded-lg
  },
  avatar: {
    width: 40, // w-10
    height: 40, // h-10
    borderRadius: 20, // rounded-full
    marginRight: 12, // mr-3
    backgroundColor: '#E5E7EB', // фон-заглушка
  },
  textContainer: {
    flex: 1, // Занимает все доступное место
  },
  title: {
    fontFamily: 'Onest-SemiBold',
    fontSize: 16, // text-base
    color: '#111827', // text-black
  },
  subtitle: {
    fontFamily: 'Onest-Regular',
    fontSize: 14, // text-sm
    color: '#6B7280', // text-gray-500
  },
});

export default CommunityLink;