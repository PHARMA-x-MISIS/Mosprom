// components/icons/ProfileIcon.tsx
import React from 'react';
import { Feather } from '@expo/vector-icons';


interface IconProps {
  color?: string;
  size?: number;

}

export function ProfileIcon({ color = 'black', size = 24 }: IconProps) {
  return <Feather name="user" size={size} color={color} />;
}