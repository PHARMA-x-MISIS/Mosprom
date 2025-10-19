// app/(main)/_layout.tsx
import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { useAuth } from 'src/lib/contexts/AuthContext';

// Импортируем все иконки, которые будут использоваться в таб-баре
import { 
  ProfileIcon, 
  CommunityIcon, 
  ServiceIcon,
  ChatIcon
} from 'components/icons'; 

/**
 * Этот layout отвечает за навигацию ВНУТРИ основной части приложения
 * для авторизованных пользователей.
 */
export default function MainAppLayout() {
  const { token } = useAuth();

  // Если токена нет (например, пользователь вышел из системы),
  // не рендерим табы, а сразу перенаправляем на экран входа.
  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  // Если токен есть, показываем навигацию с вкладками.
  return (
    <Tabs 
      screenOptions={{
        headerShown: false, // Скрываем стандартный заголовок для всех вкладок
        tabBarActiveTintColor: '#E94975',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontFamily: 'Onest-Medium',
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 90, // Можно настроить высоту таб-бара
          paddingBottom: 30, // Отступ снизу для iPhone
        },
      }}
    >
      {/* --- Видимые вкладки --- */}
      <Tabs.Screen
        name="feed" 
        options={{
          title: 'Новости',
          tabBarIcon: ({ color }) => <CommunityIcon color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="services" 
        options={{
          title: 'Сервисы',
          tabBarIcon: ({ color }) => <ServiceIcon color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="chat" 
        options={{
          title: 'Чат',
          tabBarIcon: ({ color }) => <ChatIcon color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }) => <ProfileIcon color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}