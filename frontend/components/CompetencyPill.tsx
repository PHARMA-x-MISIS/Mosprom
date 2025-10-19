import React from 'react';
import { View, Text } from 'react-native';


type PillColorType = 'orange' | 'blue' | 'yellow' | 'green' | 'lightgreen';

interface CompetencyPillProps {
  text: string;
  colorType: PillColorType;
}

const colorStyles: Record<PillColorType, { bg: string; text: string }> = {
  orange: {
    bg: 'bg-[#FFC995]',
    text: 'text-black',
  },
  blue: {
    bg: 'bg-[#ABB2FF]',
    text: 'text-black',
  },
  yellow: {
    bg: 'bg-[#F4FF96]',
    text: 'text-black',
  },
  green: {
    bg: 'bg-[#00C587]',
    text: 'text-black'
  },
  lightgreen: {
    bg: 'bg-[#79FF9F]',
    text: 'text-black'
  }
};


const CompetencyPill = ({ text, colorType }: CompetencyPillProps) => {
  const currentStyles = colorStyles[colorType];

  return (
    <View className={`self-start rounded-full px-4 py-2 ${currentStyles.bg}`}>
      <Text 
        className={`font-onest-semibold text-[16px] ${currentStyles.text}`}
        numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
};

export default CompetencyPill;