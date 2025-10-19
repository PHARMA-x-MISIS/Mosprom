import React from 'react';
import { AppWindow } from 'lucide-react-native'; // Используем подходящую иконку из lucide

interface IconProps {
  color?: string;
  size?: number;
}

export function ServiceIcon({ color = 'black', size = 24 }: IconProps) {
  return <AppWindow size={size} color={color} />;
}
