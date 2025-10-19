// components/ProductCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Coin } from './icons';

interface ProductCardProps {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  onExchangePress: () => void;
}

export default function ProductCard({
  imageUrl,
  title,
  description,
  price,
  onExchangePress,
}: ProductCardProps) {
  return (
    <View className="bg-white rounded-2xl p-4 flex-row items-center mb-4 shadow-sm shadow-black/5">
      <Image
        source={{ uri: imageUrl }}
        className="w-24 h-24 rounded-lg bg-gray-100 mr-4"
      />
      <View className="flex-1">
        <Text className="font-onest-semibold text-base text-black mb-1">
          {title}
        </Text>
        <Text className="font-onest-regular text-sm text-gray-500">
          {description}
        </Text>
        <View className="flex-row items-center my-2">
          <Coin />
          <Text className="font-onest-medium text-base text-black ml-2">
            {price}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onExchangePress}
          className="bg-[#E5426B] rounded-full self-start px-6 py-2"
          activeOpacity={0.8}
        >
          <Text className="font-onest-semibold text-white text-sm">
            Обменять
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}