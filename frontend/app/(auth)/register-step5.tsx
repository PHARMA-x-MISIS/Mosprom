// app/(auth)/register-step5.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Alert 
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Button from 'components/Button';
import AuthLayout from 'layouts/AuthLayout';
import SuccessModal from 'components/SuccessModal';
import { Photo } from 'components/icons';
import { useRegistration } from 'src/lib/contexts/RegistrationContext';
import { registerUser } from 'api/api';

export default function RegisterStep5Screen() {
  const { data } = useRegistration();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Требуется разрешение', 'Пожалуйста, предоставьте доступ к вашей галерее.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    
    const finalData = {
      email: data.email!,
      first_name: data.first_name!,
      last_name: data.last_name!,
      patronymic: "", 
      description: data.description || "",
      contact: data.contact || "",
      place_of_job: data.place_of_job || "",
      place_of_study: data.place_of_study || "",
      password: data.password!,
      skills: data.skills || [],
    };
    
    try {
      await registerUser(finalData);
      // При успехе - показываем модальное окно
      setShowModal(true);
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Ошибка регистрации', (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Эта функция будет вызываться из обеих кнопок модального окна
  const redirectToLogin = () => {
    setShowModal(false);
    // Переходим на экран логина и передаем email для автозаполнения
    router.replace({
      pathname: '/(auth)/login',
      params: { email: data.email },
    });
  };

  return (
    <>
      <AuthLayout
        title="Регистрация"
        subtitle="добавьте фото профиля"
        showBackButton
        footer={
          <View className="px-5">
            <Button
              title={isSubmitting ? "Регистрация..." : "Завершить"}
              onPress={onSubmit}
              disabled={isSubmitting}
            />
          </View>
        }>
        <View className="items-center pt-16">
          <TouchableOpacity 
            onPress={pickImage}
            activeOpacity={0.8}
            className="relative">
            <View className="w-40 h-40 rounded-full bg-gray-200 items-center justify-center overflow-hidden">
              {avatarUri ? (
                <Image 
                  source={{ uri: avatarUri }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center justify-center">
                  <Photo/>
                </View>
              )}
            </View>
            <View className="absolute bottom-0 right-0 w-12 h-12 bg-white rounded-full items-center justify-center border-2 border-gray-200">
              <Text className="text-red-500 text-3xl font-light">+</Text>
            </View>
          </TouchableOpacity>
        </View>
      </AuthLayout>

      <SuccessModal
        isVisible={showModal}
        onClose={redirectToLogin}
        onPrimaryPress={redirectToLogin} // Обе кнопки ведут на логин
        primaryButtonText="Войти в аккаунт"
        // Вторичную кнопку можно убрать или сделать такой же
        // onSecondaryPress={redirectToLogin}
        // secondaryButtonText="Профиль"
        title="Аккаунт создан!"
        description="Теперь вы можете войти в свой новый аккаунт, используя указанные почту и пароль."
        image={require('assets/icons/happy.png')} // Убедитесь, что путь правильный
      />
    </>
  );
}