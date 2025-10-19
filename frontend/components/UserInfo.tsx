import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ImageSourcePropType } from 'react-native';


interface UserInfoProps {
  avatarUrl: ImageSourcePropType;
  firstName: string;
  lastName: string;
}

const UserInfo = ({ avatarUrl, firstName, lastName }: UserInfoProps) => {
  return (
    <View className="flex-col items-center">
      <Image className="mb-6 h-28 w-28 rounded-full" source={avatarUrl}></Image>
      <Text className="font-onest-semibold mb-3 text-2xl leading-7 tracking-[-0.616px]">
        {firstName}
      </Text>
      <Text className="font-onest-semibold text-2xl leading-7 tracking-[-0.616px]">{lastName}</Text>
    </View>
  );
};

export default UserInfo;
