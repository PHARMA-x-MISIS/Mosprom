// app/(main)/store.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, Modal, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from 'components/ProductCard';
import Button from 'components/Button';
import { Coin, LeftArrow, TablerCoins } from 'components/icons';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', title: 'Зонт микрон', description: 'Твоя защита от дождя и скуки', price: 4000, imageUrl: 'https://4kraski.ru/assets/images/products/24837/6116.30-2-1000x1000.jpg' },
  { id: '2', title: 'Худи микрон', description: 'Уют и стиль — на каждый день', price: 2000, imageUrl: 'https://files.indiwd.com/app/products/616/gallery/66a0fba305a40.jpg' },
  { id: '3', title: 'Значок', description: 'Маленький символ большой команды', price: 300, imageUrl: 'https://s.a-5.ru/i/file/161/7/e1/e3/e1e3b076d22ce2d9.jpg' },
  { id: '4', title: 'Значок', description: 'Маленький символ большой команды', price: 300, imageUrl: 'https://s.a-5.ru/i/file/161/7/e1/e3/e1e3b076d22ce2d9.jpg' },
];

export default function StoreScreen() {
  const [userBalance, setUserBalance] = useState(2400);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 380;

  const handleExchangePress = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedProduct && userBalance >= selectedProduct.price) {
      setUserBalance(userBalance - selectedProduct.price);
      setIsModalVisible(false);
      // Здесь можно добавить уведомление об успешной покупке
    }
  };

  const handleCancelPurchase = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: false,
          headerStyle: {
            backgroundColor: '#F9FAFB',
          },
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <LeftArrow />
            </TouchableOpacity>
          ),
          headerTitle: '',
          headerTitleStyle: {
            fontFamily: 'Onest-Semibold',
            fontSize: 18,
          },
        }}
      />

      <View className="flex-1">
        <FlatList
          data={MOCK_PRODUCTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              {...item}
              onExchangePress={() => handleExchangePress(item)}
            />
          )}
          ListHeaderComponent={
            <View className="pb-4">
              <Text 
                className="font-onest-semibold text-black mb-3"
                style={{ fontSize: isSmallScreen ? 20 : 24 }}
              >
                Магазин сообщества
              </Text>
              <View className="flex-row items-center">
                <Coin />
                <Text 
                  className="font-onest-medium text-black ml-2"
                  style={{ fontSize: isSmallScreen ? 14 : 16 }}
                >
                  У вас {userBalance}
                </Text>
                <TouchableOpacity onPress={() => setIsInfoModalVisible(true)}>
                  <Text 
                    className="font-onest-semibold text-[#E5426B] ml-2"
                    style={{ fontSize: isSmallScreen ? 14 : 16 }}
                  >
                    как получить?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: isSmallScreen ? 16 : 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Модальное окно подтверждения покупки */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelPurchase}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
            {/* Заголовок */}
            <View className="pt-6 pb-4 px-6">
              <Text className="font-onest-semibold text-xl text-center text-black">
                Подтверждение
              </Text>
              <Text className="font-onest-regular text-base text-center text-gray-500 mt-2">
                Обменять {selectedProduct?.price} очков сообщества на {selectedProduct?.title}?
              </Text>
            </View>

            {/* Изображение товара */}
            <View className="px-6 pb-6">
              <View className="bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                <Image 
                  source={{ uri: selectedProduct?.imageUrl }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Баланс */}
            <View className="px-6 pb-6 flex-row items-center justify-center">
              <Coin />
              <Text className="font-onest-medium text-base text-gray-600 ml-2">
                У вас {userBalance}
              </Text>
            </View>

            {/* Кнопки */}
            <View className="flex-row">
              <TouchableOpacity 
                onPress={handleCancelPurchase}
                className="flex-1 py-4 items-center justify-center border-t border-gray-200"
              >
                <Text className="font-onest-semibold text-base text-[#E5426B]">
                  Отмена
                </Text>
              </TouchableOpacity>
              
              <View className="w-px bg-gray-200" />
              
              <TouchableOpacity 
                onPress={handleConfirmPurchase}
                className="flex-1 py-4 items-center justify-center border-t border-gray-200"
                disabled={userBalance < (selectedProduct?.price || 0)}
              >
                <Text 
                  className="font-onest-semibold text-base"
                  style={{ 
                    color: userBalance < (selectedProduct?.price || 0) ? '#9CA3AF' : '#E5426B' 
                  }}
                >
                  Согласен
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно "Как получать баллы?" */}
      <Modal
        visible={isInfoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsInfoModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
            {/* Иконка */}
            <View className="pt-8 pb-4 items-center">
              <View className="w-20 h-20 items-center justify-center">
                <TablerCoins/>
              </View>
            </View>

            {/* Заголовок */}
            <View className="px-6 pb-3">
              <Text className="font-onest-semibold text-xl text-center text-black">
                Как получать баллы?
              </Text>
            </View>

            {/* Описание */}
            <View className="px-6 pb-6">
              <Text className="font-onest-regular text-base text-center text-gray-500 leading-6">
                Получайте баллы за активность в сообществе. Участие в оффлайн событиях дает больше баллов чем лайки и комментарии
              </Text>
            </View>

            {/* Кнопка */}
            <View className="px-6 pb-6">
              <Button 
                title="Понятно" 
                onPress={() => setIsInfoModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}