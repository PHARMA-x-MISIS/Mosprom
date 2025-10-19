// app/(community)/_layout.tsx
import { Stack } from 'expo-router';
import { CommunityProvider } from 'src/lib/contexts/CommunityContext';

export default function CommunityCreationLayout() {
  return (
    <CommunityProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CommunityProvider>
  );
}