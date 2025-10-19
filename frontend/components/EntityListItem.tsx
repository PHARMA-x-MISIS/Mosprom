// components/EntityListItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native'; // Пример иконки

interface EntityListItemProps {
  title: string;
  subtitle: string;
  // --- ИСПРАВЛЕНИЕ 2: Изменяем тип, чтобы он мог быть null или undefined ---
  imageUrl?: string | null; 
  isVerified?: boolean;
  onPress?: () => void;
  onActionPress?: () => void;
  ActionIcon?: React.ElementType<any>;
}

export default function EntityListItem({
  title,
  subtitle,
  imageUrl,
  isVerified,
  onPress,
  onActionPress,
  ActionIcon,
}: EntityListItemProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} style={styles.container}>
      {/* --- ИСПРАВЛЕНИЕ 2: Добавляем условие для рендеринга Image --- */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.avatar} />
      ) : (
        // Если imageUrl нет, показываем заглушку
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarPlaceholderText}>{title.charAt(0)}</Text>
        </View>
      )}

      <View style={styles.textContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.title}>{title}</Text>
          {isVerified && <Check size={16} color="green" style={{ marginLeft: 4 }} />}
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {ActionIcon && (
        <TouchableOpacity onPress={onActionPress} style={styles.actionButton}>
          <ActionIcon color="#E94975" size={24} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
    avatarPlaceholder: {
      backgroundColor: '#e5e7eb',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarPlaceholderText: {
      fontFamily: 'Onest-SemiBold',
      fontSize: 18,
      color: '#4b5563',
    },
    textContainer: { flex: 1 },
    title: { fontFamily: 'Onest-Medium', fontSize: 16, color: '#111827' },
    subtitle: { fontFamily: 'Onest-Regular', fontSize: 14, color: '#6B7280', marginTop: 2 },
    actionButton: { padding: 8 },
});