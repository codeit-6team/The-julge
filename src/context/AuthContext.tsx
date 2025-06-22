import { createContext, useState, useEffect, type ReactNode } from 'react';
import { getAlerts, putAlerts, type AlertViewResponse } from '@/api/alertApi';
type UserRole = 'employer' | 'employee' | null;

interface AuthContextType {
  isLoggedIn: boolean; // 로그인 여부
  role: UserRole; // 알바님, 사장님 구분
  alarms: AlertViewResponse; // 알림 정보
  login: (token: string, role: UserRole, userId: string) => void; // 로그인 함수
  logout: () => void; // 로그아웃 함수
  markAlertAsRead: (alertId: string) => void;
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
  markAlertAsRead: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [alarms, setAlarms] = useState<AlertViewResponse>(
    defaultAuthContext.alarms,
  );

  useEffect(() => {
    const fetchAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const userRole = localStorage.getItem('userRole') as UserRole;
      const userId = localStorage.getItem('userId');

      if (token && userRole && userId) {
        setIsLoggedIn(true);
        setRole(userRole);
        try {
          const alertRes = await getAlerts(userId);
          setAlarms(alertRes);
        } catch (error) {
          console.error('앱 로딩 중 알림 가져오기 실패:', error);
        }
      }
    };

    fetchAuth();
  }, []);

  const login = async (token: string, role: UserRole, userId: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userRole', role || '');
    localStorage.setItem('userId', userId);
    setIsLoggedIn(true);
    setRole(role);
    try {
      const alertRes = await getAlerts(userId);
      setAlarms(alertRes);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setRole(null);
    setAlarms(defaultAuthContext.alarms);
  };

  const markAlertAsRead = async (alertId: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('읽음 처리 실패: userId를 찾을 수 없습니다.');
      return;
    }

    setAlarms((prevAlarms) => ({
      ...prevAlarms,
      items: prevAlarms.items.filter((alert) => alert.item.id !== alertId),
    }));

    try {
      await putAlerts(userId, alertId);
    } catch (error) {
      console.error('API - 알림 읽음 처리 실패:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, alarms, login, logout, markAlertAsRead }}
    >
      {children}
    </AuthContext.Provider>
  );
}
