// app/(auth)/_layout.tsx (Правильная версия)
import { Stack } from 'expo-router';
import { RegistrationProvider } from 'src/lib/contexts/RegistrationContext'; // Убедитесь, что путь правильный

export default function AuthStackLayout() {
  return (
    // RegistrationProvider нужен только для экранов регистрации,
    // поэтому его место здесь - это нормально.
    <RegistrationProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="register-step2" />
        <Stack.Screen name="register-step3" />
        <Stack.Screen name="register-step4" />
        <Stack.Screen name="register-step5" />
      </Stack>
    </RegistrationProvider>
  );
}