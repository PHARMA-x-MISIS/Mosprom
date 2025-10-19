import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

interface AboutUserBlockProps {
  about: string;
}

const AboutUserBlock = ({about}: AboutUserBlockProps) => {

  return (
    <View className="rounded-3xl bg-gray-100 p-4">
      <Text className="mb-5 text-[17px] font-onest-semibold">Обо мне</Text>
      <View className="mb-[10px]">
        <Text className='font-onest-medium text-[16px]'>{about}</Text>
      </View>
    </View>
  );
};

export default AboutUserBlock;