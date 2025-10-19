import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import CompetencyPill from './CompetencyPill';

interface CompetencyBlockProps {
  skills: string[];
}

export default function CompetencyBlock({ skills }: CompetencyBlockProps) {
  const COLORS: Array<'orange' | 'lightgreen' | 'yellow' | 'green' | 'blue'> = ['orange', 'lightgreen', 'yellow', 'blue', 'green'];

  const [isExpanded, setIsExpanded] = useState(false);
  const displayCount = 5; 


  if (!skills || skills.length === 0) {
    return (
      <View className="rounded-3xl bg-gray-100 p-4">
        <Text className="mb-2 text-[17px] font-onest-semibold">Мои компетенции</Text>
        <Text className="font-onest-regular text-gray-500">Компетенции не указаны.</Text>
      </View>
    );
  }

  const displayedCompetencies = isExpanded ? skills : skills.slice(0, displayCount);
  const hasMore = skills.length > displayCount;

  return (
    <View className="rounded-3xl bg-gray-100 p-4">
      <Text className="mb-5 text-[17px] font-onest-semibold">Мои компетенции</Text>

      <View className="flex-row flex-wrap gap-2 mb-[10px]">
        {displayedCompetencies.map((skill, index) => (
          <CompetencyPill
            key={`${skill}-${index}`} 
            text={skill}
            colorType={COLORS[index % COLORS.length]}
          />
        ))}
        {!isExpanded && hasMore && (
          <View className="self-start rounded-full bg-gray-300 px-4 py-2">
            <Text className="text-[16px] text-gray-600 font-onest-semibold">
              +{skills.length - displayCount} ещё
            </Text>
          </View>
        )}
      </View>

      {hasMore && (
        <Pressable
          className="flex-row items-center self-start"
          onPress={() => setIsExpanded(!isExpanded)}>
          <Text className="mr-2 text-[#3464D8] font-onest-medium">
            {isExpanded ? 'Свернуть' : 'Показать все →'}
          </Text>
        </Pressable>
      )}
    </View>
  );
};