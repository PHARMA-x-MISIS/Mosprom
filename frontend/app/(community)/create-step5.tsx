// app/(community)/create-step5.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Button from 'components/Button';
import AuthLayout from 'layouts/AuthLayout';
import SuccessModal from 'components/SuccessModal'; 
import { Photo } from 'components/icons';
// --- API и Контекст ---
import { useCommunityCreation } from 'src/lib/contexts/CommunityContext';
import { createCommunity } from 'api/api';
import { CommunityRead } from 'api/types';
import { useState } from 'react';

export default function CreateCommunityStep5Screen() {
  const { data } = useCommunityCreation(); // Получаем все собранные данные
  const [avatar, setAvatar] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newlyCreatedCommunity, setNewlyCreatedCommunity] = useState<CommunityRead | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Необходимо разрешение для доступа к галерее');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  const onFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Собираем данные из контекста для отправки в API
      const apiData = {
        title: data.title!, // Название обязательно
        description: data.description,
        // TODO: moderator_ids здесь пока не используется, т.к. в Swagger его нет в CommunityCreate
      };

      // 1. Создаем сообщество
      const newCommunity = await createCommunity(apiData);
      setNewlyCreatedCommunity(newCommunity); // Сохраняем данные для редиректа
      console.log('Сообщество создано:', newCommunity);

      // 2. TODO: Если выбран аватар, загружаем его.
      // Эндпоинт: PUT /communities/{community_id}/avatar (ожидает multipart/form-data)
      if (avatar) {
        // const formData = new FormData();
        // formData.append('file', { uri: avatar.uri, name: 'avatar.jpg', type: 'image/jpeg' } as any);
        // await uploadCommunityAvatar(newCommunity.id, formData);
        console.log('Имитация загрузки аватара для ID:', newCommunity.id);
      }

      setModalVisible(true); // Показываем модальное окно успеха

    } catch (error) {
      Alert.alert('Ошибка создания', (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToCommunity = () => {
    setModalVisible(false);
    if (newlyCreatedCommunity) {
      // Перенаправляем на страницу только что созданного сообщества
      router.replace(`/(main)/community/${newlyCreatedCommunity.id}`);
    } else {
      router.replace('/(main)/feed'); // Если что-то пошло не так, возвращаемся в ленту
    }
  };

  return (
    <>
      <AuthLayout
        title="Установите аватар"
        subtitle="Фотография делает сообщество узнаваемым"
        showBackButton
        footer={
          <View style={styles.footer}>
            <Button 
              title={isSubmitting ? "Создание..." : "Завершить"} 
              onPress={onFinalSubmit}
              disabled={isSubmitting}
            />
          </View>
        }>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            style={styles.avatarContainer}
          >
            <View style={styles.avatarWrapper}>
              {avatar ? (
                <Image
                  source={{ uri: avatar.uri }}
                  style={styles.avatarImage}
                />
              ) : (
                <Photo width={48} height={48} color="#9CA3AF" />
              )}
            </View>

            <View style={styles.plusIcon}>
              <Text style={styles.plusIconText}>+</Text>
            </View>
          </TouchableOpacity>
          {isSubmitting && <ActivityIndicator style={{ marginTop: 20 }} size="large" />}
        </View>
      </AuthLayout>

      <SuccessModal
              isVisible={isModalVisible}
              onClose={handleNavigateToCommunity}
              onPrimaryPress={handleNavigateToCommunity}
              title="Сообщество создано!"
              description="Пора оформить его, пригласить первых подписчиков и начать делиться контентом."
              primaryButtonText="Перейти в сообщество" image={0}        // Убрали вторую кнопку
      />
    </>
  );
}

// --- Стили ---
const styles = StyleSheet.create({
  footer: { paddingHorizontal: 20 },
  container: { alignItems: 'center', paddingTop: 64 },
  avatarContainer: { position: 'relative' },
  avatarWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  plusIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f3f4f6',
  },
  plusIconText: { color: '#E94975', fontSize: 30, fontWeight: '300' },
});