import React from 'react';
import { View, Text, TextInput, TextInputProps, VirtualizedList } from 'react-native';

interface LabeledInputProps extends TextInputProps {
  label: string;
  error?: string;
  required: boolean,
}

const LabeledInput = ({ label, error, required, ...rest }: LabeledInputProps) => {
  const isError = !!error;
  const borderColor = isError ? 'border-red-500' : 'border-gray-400 focus:border-blue-500';
  
  return (
    <View className="mb-4">
      <View className='flex-row'>
      <Text className="font-onest-semibold text-lg mb-2 text-black">{label}</Text>
      <Text className='font-onest-semibold text-lg text-red-500'>{required ? ' *' : ''}</Text>
      </View>
      <TextInput
        className={`
          border-[1.5px] rounded-xl p-4 text-base font-onest-regular
          ${borderColor}
          text-black
        `}
        placeholderTextColor="#A2A2A2"
        {...rest}
      />
      {isError && (
        <Text className="text-red-500 mt-1 text-sm">{error}</Text>
      )}
    </View>
  );
};

export default LabeledInput;