import { createContext, useState, useEffect, type ReactNode } from 'react';
import { getAlerts, type AlertViewResponse } from '@/api/alertApi';
type UserRole = 'employer' | 'employee' | null;

interface AuthContextType {
  isLoggedIn: boolean; // 로그인 여부
  role: UserRole; // 알바님, 사장님 구분
  alarms: AlertViewResponse; // 알림 정보
  login: (token: string, role: UserRole, userId: string) => void; // 로그인 함수
  logout: () => void; // 로그아웃 함수
}

const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  role: null,
  alarms: {
    offset: 0,
    limit: 0,
    count: 0,
    hasNext: false,
    items: [],
    links: [],
  },
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [alarms, setAlarms] = useState<AlertViewResponse>(
    defaultAuthContext.alarms,
  );

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
