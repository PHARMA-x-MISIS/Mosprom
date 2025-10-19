import React from 'react';
import { Feather } from '@expo/vector-icons';


interface IconProps {
  color?: string;
  size?: number;
}

export function CommunityIcon({ color = 'black', size = 24 }: IconProps) {
  return <Feather name="users" size={size} color={color} />;
}