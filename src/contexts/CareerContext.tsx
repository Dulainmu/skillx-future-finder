import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { careersApi } from '@/services/careersApi';

interface CareerContextType {
  hasStartedCareer: boolean;
  currentCareer: string | null;
  startCareer: (careerId: string) => void;
  resetCareer: () => void;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (context === undefined) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [hasStartedCareer, setHasStartedCareer] = useState(user?.hasStartedCareer || false);
  const [currentCareer, setCurrentCareer] = useState<string | null>(user?.currentCareer || null);

  useEffect(() => {
    if (user) {
      setHasStartedCareer(user.hasStartedCareer || false);
      setCurrentCareer(user.currentCareer || null);
    }
  }, [user]);

  const startCareer = async (careerId: string) => {
    try {
      await careersApi.startCareer(careerId);
      setHasStartedCareer(true);
      setCurrentCareer(careerId);
      updateUser({ hasStartedCareer: true, currentCareer: careerId });
    } catch (error) {
      console.error('Failed to start career:', error);
      throw error;
    }
  };

  const resetCareer = () => {
    setHasStartedCareer(false);
    setCurrentCareer(null);
    updateUser({ hasStartedCareer: false, currentCareer: null });
  };

  return (
    <CareerContext.Provider value={{
      hasStartedCareer,
      currentCareer,
      startCareer,
      resetCareer
    }}>
      {children}
    </CareerContext.Provider>
  );
};