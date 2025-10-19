// app/(main)/services.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MessageCircle, PlusCircle } from 'lucide-react-native';
import { LucideProps } from 'lucide-react-native'; // Импортируем тип для иконок


interface ServiceButtonProps {
  title: string;
  icon: React.ElementType<LucideProps>; // Тип для компонента иконки
  onPress: () => void;
}

// --- Применяем интерфейс ---
const ServiceButton = ({ title, icon: Icon, onPress }: ServiceButtonProps) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Icon color="#374151" size={24} />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default function ServicesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Сервисы</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <ServiceButton 
          title="Рекомендации для вас"
          icon={Star}
          onPress={() => router.push('/(main)/recommendations')}
        />
        <ServiceButton 
          title="Техноша"
          icon={MessageCircle}
          onPress={() => router.push('/(main)/chat')}
        />
        <ServiceButton 
          title="Создать сообщество"
          icon={PlusCircle}
          onPress={() => router.push('/(community)/create-step1')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: 16, paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontFamily: 'Onest-SemiBold', fontSize: 22, textAlign: 'center' },
  buttonContainer: { padding: 16, gap: 12 },
  button: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f3f4f6', 
    padding: 16, 
    borderRadius: 12 
  },
  buttonText: { fontFamily: 'Onest-Medium', fontSize: 16, marginLeft: 12 },
});