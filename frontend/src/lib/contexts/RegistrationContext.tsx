import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface RegistrationData {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  description?: string;
  contact?: string;
  place_of_job?: string;
  place_of_study?: string;
  skills?: string[];
  birthDate?: string; 
}

interface RegistrationContextType {
  data: RegistrationData;
  updateData: (newData: Partial<RegistrationData>) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<RegistrationData>({});

  const updateData = (newData: Partial<RegistrationData>) => {
    setData(prevData => ({ ...prevData, ...newData }));
  };

  return (
    <RegistrationContext.Provider value={{ data, updateData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};