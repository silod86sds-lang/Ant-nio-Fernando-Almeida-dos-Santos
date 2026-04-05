import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent, Citizen, Vehicle, InfractionRecord, agents, citizens, vehicles, initialInfractions } from './mockData';

type AppContextType = {
  currentUser: Agent | null;
  login: (nif: string, pass: string) => boolean;
  logout: () => void;
  
  citizensData: Citizen[];
  vehiclesData: Vehicle[];
  infractionsData: InfractionRecord[];
  
  addInfraction: (infraction: Omit<InfractionRecord, 'id' | 'code'>) => void;
  updateCitizenLicense: (bi: string, status: Citizen['licenseStatus']) => void;
  payFine: (id: string) => void;
  
  dailyStats: {
    inspected: number;
    infractions: number;
    fines: number;
    date?: string;
  };
  incrementInspected: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Agent | null>(null);
  
  const [citizensData, setCitizensData] = useState<Citizen[]>(() => getInitialState('sift_citizens', citizens));
  const [vehiclesData, setVehiclesData] = useState<Vehicle[]>(() => getInitialState('sift_vehicles', vehicles));
  const [infractionsData, setInfractionsData] = useState<InfractionRecord[]>(() => getInitialState('sift_infractions', initialInfractions));
  
  const [dailyStats, setDailyStats] = useState(() => getInitialState('sift_stats', { 
    inspected: 0, infractions: 0, fines: 0, date: new Date().toDateString() 
  }));

  // Persist state changes to LocalStorage
  useEffect(() => { localStorage.setItem('sift_citizens', JSON.stringify(citizensData)); }, [citizensData]);
  useEffect(() => { localStorage.setItem('sift_vehicles', JSON.stringify(vehiclesData)); }, [vehiclesData]);
  useEffect(() => { localStorage.setItem('sift_infractions', JSON.stringify(infractionsData)); }, [infractionsData]);
  useEffect(() => { localStorage.setItem('sift_stats', JSON.stringify(dailyStats)); }, [dailyStats]);

  // Reset daily stats if it's a new day
  useEffect(() => {
    const today = new Date().toDateString();
    if (dailyStats.date !== today) {
      setDailyStats({ inspected: 0, infractions: 0, fines: 0, date: today });
    }
  }, []);

  // Update overdue fines on load
  useEffect(() => {
    const now = new Date();
    setInfractionsData(prev => prev.map(inf => {
      if (inf.type === 'fine' && inf.status === 'Não pago' && inf.deadline && new Date(inf.deadline) < now) {
        return { ...inf, status: 'Em atraso' };
      }
      return inf;
    }));
  }, []);

  const login = (nif: string, pass: string) => {
    const agent = agents.find(a => a.nif === nif && a.password === pass);
    if (agent) {
      setCurrentUser(agent);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addInfraction = (infraction: Omit<InfractionRecord, 'id' | 'code'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const code = infraction.type === 'fine' ? `MULTA-${Math.floor(Math.random() * 10000)}` : undefined;
    
    setInfractionsData(prev => [{ ...infraction, id: newId, code }, ...prev]);
    
    setDailyStats(prev => ({
      ...prev,
      infractions: prev.infractions + 1,
      fines: infraction.type === 'fine' ? prev.fines + 1 : prev.fines
    }));
  };

  const updateCitizenLicense = (bi: string, status: Citizen['licenseStatus']) => {
    setCitizensData(prev => prev.map(c => c.bi === bi ? { ...c, licenseStatus: status } : c));
  };

  const payFine = (id: string) => {
    setInfractionsData(prev => prev.map(inf => inf.id === id ? { ...inf, status: 'Pago' } : inf));
  };

  const incrementInspected = () => {
    setDailyStats(prev => ({ ...prev, inspected: prev.inspected + 1 }));
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      citizensData, vehiclesData, infractionsData,
      addInfraction, updateCitizenLicense, payFine,
      dailyStats, incrementInspected
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
