// app/(main)/recommendations.tsx - обнови onPress для EntityListItem
import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import EntityListItem from 'components/EntityListItem';
import { Plus, CheckIcon } from 'components/icons';

const MOCK_COMMUNITIES = [
  { id: '1', name: 'Р Фарм', category: 'Техника', subscribers: 797, avatarUrl: 'https://i.pravatar.cc/150?u=a1', isVerified: true },
  { id: '2', name: 'СтудКлуб ИТ', category: 'IT и разработка', subscribers: 1204, avatarUrl: 'https://i.pravatar.cc/150?u=a2', isVerified: false },
  { id: '3', name: 'Механики Политеха', category: 'Техника', subscribers: 540, avatarUrl: 'https://i.pravatar.cc/150?u=a3', isVerified: false },
  { id: '4', name: 'БиоИнженеры', category: 'Наука', subscribers: 350, avatarUrl: 'https://i.pravatar.cc/150?u=a4', isVerified: true },
  { id: '5', name: 'Клуб Дебатов', category: 'Гуманитарные науки', subscribers: 880, avatarUrl: 'https://i.pravatar.cc/150?u=a5', isVerified: false },
];

export default function RecommendationsScreen() {
  const [subscribedIds, setSubscribedIds] = useState<string[]>([]);

  const toggleSubscription = (id: string) => {
    setSubscribedIds(prev =>
      prev.includes(id)
        ? prev.filter(subId => subId !== id)
        : [...prev, id]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1">
        <View className="py-3 bg-white">
          <Text style={{ fontFamily: 'Onest-SemiBold', fontSize: 22 }} className="text-center">
            Для вас
          </Text>
        </View>

        <FlatList
          data={MOCK_COMMUNITIES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSubscribed = subscribedIds.includes(item.id);
            return (
              <EntityListItem
                title={item.name}
                subtitle={`${item.category}, ${item.subscribers} подписчиков`}
                imageUrl={item.avatarUrl}
                isVerified={item.isVerified}
                onPress={() => router.push(`/(main)/(community)/${item.id}`)}
                onActionPress={() => toggleSubscription(item.id)}
                ActionIcon={isSubscribed ? CheckIcon : Plus}
              />
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
          ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
        />
        
      </View>
    </SafeAreaView>
  );
}