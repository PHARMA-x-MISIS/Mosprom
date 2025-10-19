// app/(main)/chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { postChatMessage } from 'api/api';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: 'Привет! Я Техноша, твой AI ассистент. Чем могу помочь?', 
      isUser: false, 
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage: Message = { 
      id: Date.now(), 
      text: inputText, 
      isUser: true, 
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMessage]);
    
    const messageToSend = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const response = await postChatMessage(messageToSend);

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: response.reply, // Используем ответ из API
        isUser: false,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error("Ошибка при получении ответа от AI:", error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: 'К сожалению, не удалось получить ответ. Попробуйте еще раз.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 py-4 flex-row items-center">
          <TouchableOpacity className="mr-3" onPress={() => router.back()}>
            <Text style={{ fontFamily: 'Onest-Regular', fontSize: 24 }} className="text-gray-700">←</Text>
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3"><Text className="text-lg">🤖</Text></View>
          <View>
            <Text style={{ fontFamily: 'Onest-SemiBold', fontSize: 16 }} className="text-gray-900">Техноша</Text>
            <Text style={{ fontFamily: 'Onest-Regular', fontSize: 12 }} className="text-gray-500">Онлайн</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView ref={scrollViewRef} className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 10 }}>
          {messages.map((message) => (
            <View key={message.id} className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}>
              
              {message.isUser ? (
              <LinearGradient
                  colors={['#E5426B', '#E8A80A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    maxWidth: '75%',
                    borderRadius: 16,
                    borderTopRightRadius: 4,
                    paddingHorizontal: 16,
                    paddingVertical: 12
                  }}
                >
                  <Text style={{ fontFamily: 'Onest-Regular', fontSize: 15, lineHeight: 20 }} className="text-white">
                    {message.text}
                  </Text>
                </LinearGradient>
              ) : (
                <View className="max-w-[75%] rounded-2xl rounded-tl-sm px-4 py-3 bg-gray-100">
                  <Text style={{ fontFamily: 'Onest-Regular', fontSize: 15, lineHeight: 20 }} className="text-gray-900">
                    {message.text}
                  </Text>
                </View>
              )}

              <Text style={{ fontFamily: 'Onest-Regular', fontSize: 11 }} className="text-gray-400 mt-1 mx-2">
                {message.timestamp}
              </Text>
            </View>
          ))}
          {/* Индикатор "Печатает..." */}
          {isLoading && <View className="items-start mb-4"><View className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3"><Text style={{ fontFamily: 'Onest-Regular', fontSize: 15 }} className="text-gray-500">Печатает...</Text></View></View>}
        </ScrollView>

        {/* Input */}
        <View className="border-t border-gray-200 px-4 py-3 bg-white">
          <View className="flex-row items-end bg-gray-50 rounded-3xl px-4 py-2">
            <TextInput
              style={{ fontFamily: 'Onest-Regular', fontSize: 15 }}
              className="flex-1 text-gray-900 py-2 max-h-24"
              placeholder="Сообщение"
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity 
              onPress={sendMessage}
              className={`ml-2 w-9 h-9 rounded-full items-center justify-center ${
                inputText.trim() && !isLoading ? 'bg-[#E5426B]' : 'bg-gray-300'
              }`}
              disabled={!inputText.trim() || isLoading}
            >
              <Text className="text-white text-xl font-bold">➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}