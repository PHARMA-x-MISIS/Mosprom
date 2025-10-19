// components/SuccessModal.tsx
import React from 'react';
import { Modal, View, Text, Image, ImageSourcePropType } from 'react-native';
import Button from './Button';

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  image: ImageSourcePropType;
}

export default function SuccessModal({
  isVisible,
  onClose,
  onPrimaryPress,
  onSecondaryPress,
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  image,
}: SuccessModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50 px-5">
        <View className="bg-white rounded-2xl p-6 w-full items-center">
          <Image
            source={image}
            className="w-24 h-24 mb-4"
            resizeMode="contain"
          />
          <Text className="font-onest-semibold text-2xl text-black text-center mb-2">
            {title}
          </Text>

          <Text className="font-onest-regular text-base text-gray-500 text-center mb-8">
            {description}
          </Text>

          <View className="w-full gap-y-3">
            <Button title={primaryButtonText} onPress={onPrimaryPress} />
            
            {secondaryButtonText && onSecondaryPress && (
              <Button
                title={secondaryButtonText}
                onPress={onSecondaryPress}
                outline
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}