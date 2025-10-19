// app/(auth)/register-step4.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import Button from 'components/Button';
import AuthLayout from 'layouts/AuthLayout';
import { Lupa } from 'components/icons';
import { getAllSkills } from 'api/api';
import { useRegistration } from '../../src/lib/contexts/RegistrationContext';

type PillColorType = 'orange' | 'blue' | 'yellow' | 'green' | 'lightgreen';

interface Competency {
  id: string;
  name: string;
  color: PillColorType;
}

const colors: PillColorType[] = ['orange', 'blue', 'yellow', 'green', 'lightgreen'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export default function RegisterStep4Screen() {
  const { updateData } = useRegistration();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);
  const [allCompetencies, setAllCompetencies] = useState<Competency[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skills = await getAllSkills();
        const formattedSkills = skills.map(skill => ({
          id: skill,
          name: skill,
          color: getRandomColor(),
        }));
        setAllCompetencies(formattedSkills);
        
        // Автоматически выбираем три компетенции
        const defaultSkills = ['fastapi', 'сетевые технологии', 'бэкенд разработка'];
        const selectedDefaults = formattedSkills
          .filter(skill => defaultSkills.includes(skill.name.toLowerCase()))
          .map(skill => skill.id);
        
        if (selectedDefaults.length > 0) {
          setSelectedCompetencies(selectedDefaults);
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      }
    };
    fetchSkills();
  }, []);

  const filteredCompetencies = useMemo(() => {
    if (!searchQuery.trim()) {
      return allCompetencies;
    }
    return allCompetencies.filter(comp =>
      comp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allCompetencies]);

  const toggleCompetency = (id: string) => {
    setSelectedCompetencies(prev =>
      prev.includes(id)
        ? prev.filter(compId => compId !== id)
        : [...prev, id]
    );
  };

  const onSubmit = () => {
    if (selectedCompetencies.length < 3) {
      return;
    }
    updateData({ skills: selectedCompetencies });
    router.push('/(auth)/register-step5');
  };



  return (
    <AuthLayout
      title="Регистрация"
      subtitle="Выберите свои компетенции"
      showBackButton
      footer={
        <View className="px-5">
          <Button
            title={selectedCompetencies.length >= 3 ? "Далее" : `Далее (${selectedCompetencies.length}/3)`}
            outline={selectedCompetencies.length < 3}
            onPress={onSubmit}
          />
        </View>
      }>
      <View className="px-5">
        <View className="mb-8">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
            <Lupa width={16} height={16}/>
            <TextInput
              className="flex-1 ml-2 font-onest-regular text-base"
              placeholder="Поиск"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 justify-center">
          {filteredCompetencies.map(comp => {
            const isSelected = selectedCompetencies.includes(comp.id);
            return (
              <TouchableOpacity
                key={comp.id}
                onPress={() => toggleCompetency(comp.id)}
                activeOpacity={1}
                className={`rounded-full border ${
                  isSelected 
                    ? `border-black` 
                    : 'border-black bg-white'
                }`}>
                {isSelected ? (
                  <View className={`rounded-full px-2.5 py-1 ${
                    comp.color === 'orange' ? 'bg-[#FFC995]' :
                    comp.color === 'blue' ? 'bg-[#ABB2FF]' :
                    comp.color === 'yellow' ? 'bg-[#F4FF96]' :
                    comp.color === 'green' ? 'bg-[#00C587]' :
                    'bg-[#79FF9F]'
                  }`}>
                    <Text className="font-onest-semibold text-[15px] text-black">
                      {comp.name}
                    </Text>
                  </View>
                ) : (
                  <View className="rounded-full px-2.5 py-1 bg-white">
                    <Text className="font-onest-semibold text-[15px] text-black">
                      {comp.name}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredCompetencies.length === 0 && (
          <View className="items-center justify-center py-10">
            <Text className="text-gray-400 font-onest-regular">
              Ничего не найдено
            </Text>
          </View>
        )}
      </View>
    </AuthLayout>
  );
}