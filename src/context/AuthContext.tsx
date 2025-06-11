import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getAlerts } from '@/api/getAlerts';

type UserRole = 'employer' | 'employee' | null;

interface AlertItem {
  item: {
    id: string;
    createdAt: string;
    result: 'accepted' | 'rejected';
    read: boolean;
    application: {
      item: {
        id: string;
        status: 'pending' | 'accepted' | 'rejected';
      };
      href: string;
    };
    shop: {
      item: {
        id: string;
        name: string;
        category: string;
        address1: string;
        address2: string;
        description: string;
        imageUrl: string;
        originalHourlyPay: number;
      };
      href: string;
    };
    notice: {
      item: {
        id: string;
        hourlyPay: number;
        description: string;
        startsAt: string;
        workhour: number;
        closed: boolean;
      };
      href: string;
    };
    links: object[]; // 정확한 타입이 나와있지 않아서 우선 object로만 처리함
  };
  links: object[]; // 정확한 타입이 나와있지 않아서 우선 object로만 처리함
}

interface AlertsInfo {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: AlertItem[];
}

interface AuthContextType {
  isLoggedIn: boolean; // 로그인 여부
  role: UserRole; // 알바님, 사장님 구분
  alarms: AlertsInfo; // 알림 정보
  login: (token: string, role: UserRole, userId: string) => void; // 로그인 함수
  logout: () => void; // 로그아웃 함수
}

const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  role: null,
  alarms: { count: 0, items: [] },
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [alarms, setAlarms] = useState<AlarmInfo>(defaultAuthContext.alarms);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole') as UserRole;
    if (token && role) {
      setIsLoggedIn(true);
      setRole(role);
    }
  }, []);

  const login = async (token: string, role: UserRole, userId: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userRole', role || '');
    setIsLoggedIn(true);
    setRole(role);
    try {
      const alertRes = await getAlerts(userId);
      setAlarms(alertRes);
      console.log('alertRes', alertRes);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setRole(null);
    setAlarms(defaultAuthContext.alarms);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, alarms, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
