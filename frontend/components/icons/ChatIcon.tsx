// components/icons/ChatIcon.tsx
import React from 'react';
import { MessageCircle } from 'lucide-react-native';

interface IconProps {
  color?: string;
  size?: number;
}

export function ChatIcon({ color = 'black', size = 24 }: IconProps) {
  return <MessageCircle size={size} color={color} />;
}