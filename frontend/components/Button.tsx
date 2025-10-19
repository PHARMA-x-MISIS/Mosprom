import React from 'react';
import { Pressable, Text, View, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { UilVk } from './icons';

type SocialType = 'vk' | 'gos';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  outline?: boolean;
  social?: SocialType;
  loading?: boolean;
}

const SocialIcon = ({ type }: { type: SocialType }) => {
  if (type === 'vk') {
    return <UilVk className="mr-2" color="white" />;
  }
  if (type === 'gos') {
    return <Image source={require('../assets/icons/gos.png')} style={{ width: 25, height: 25, marginRight: 8 }} />;
  }
  return null;
};

export const Button = ({
  title,
  onPress,
  disabled = false,
  outline = false,
  social,
  loading = false,
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const isGradient = !outline && !disabled && !loading && !social;

  const textClasses = [
    'font-onest-semibold text-[18px] text-center',
    outline ? 'text-[#E94975]' : social === 'gos' ? 'text-gray-800' : 'text-white',
  ].join(' ');

  const renderContent = (pressed: boolean) => (
    <View
      className={`flex-row items-center justify-center ${pressed ? 'opacity-75' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={outline ? '#E94975' : '#FFFFFF'} />
      ) : (
        <>
          {social && <SocialIcon type={social} />}
          <Text className={textClasses}>{title}</Text>
        </>
      )}
    </View>
  );


  if (isGradient) {
    return (
      <Pressable onPress={onPress} disabled={isDisabled} className="w-full">
        {({ pressed }) => (
          <LinearGradient
            colors={['#E94975', '#F0A654']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
            }}
          >
            {renderContent(pressed)}
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  if (outline) {
    return (
      <Pressable onPress={onPress} disabled={isDisabled} className="w-full">
        {({ pressed }) => (
          <LinearGradient
            colors={['#E94975', '#F0A654']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              padding: 2, 
              borderRadius: 12,
            }}
          >
            <View className="bg-white rounded-[10px] py-3 px-6">
              {renderContent(pressed)}
            </View>
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  
  const containerClasses = [
    'w-full py-3 px-6 rounded-xl flex-row justify-center items-center',
    disabled || loading
      ? 'bg-gray-500'
      : social === 'vk'
      ? 'bg-[#4273E5]'
      : 'bg-[#EFEFEF]',
  ].join(' ');

  return (
    <Pressable className={containerClasses} onPress={onPress} disabled={isDisabled}>
      {({ pressed }) => renderContent(pressed)}
    </Pressable>
  );
};

export default Button;