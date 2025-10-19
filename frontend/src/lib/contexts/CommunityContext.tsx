// src/lib/contexts/CommunityContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Тип данных, которые мы будем собирать
export interface CommunityCreationData {
  title?: string;
  description?: string;
  website?: string;
  targetAudience?: 'school' | 'student' | 'graduate';
  skills?: string[];
  moderator_ids?: number[]; // Swagger ожидает ID модераторов, а не менторов
}

interface CommunityContextType {
  data: CommunityCreationData;
  updateData: (newData: Partial<CommunityCreationData>) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<CommunityCreationData>({});
  const updateData = (newData: Partial<CommunityCreationData>) => {
    setData(prevData => ({ ...prevData, ...newData }));
  };
  return (
    <CommunityContext.Provider value={{ data, updateData }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunityCreation = () => {
  const context = useContext(CommunityContext);
  if (!context) throw new Error('useCommunityCreation must be used within a CommunityProvider');
  return context;
};