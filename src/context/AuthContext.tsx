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
    // 앱이 처음 로딩되거나 새로고침될 때 실행되는 함수
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const userRole = localStorage.getItem('userRole') as UserRole;
      const userId = localStorage.getItem('userId');

      // 토큰과 userId가 모두 있어야 로그인 상태로 인정하고 알림을 가져옵니다.
      if (token && userRole && userId) {
        setIsLoggedIn(true);
        setRole(userRole);
        try {
          // ✨ 새로고침 시에도 알림을 가져오는 API 호출 로직 추가
          const alertRes = await getAlerts(userId);
          setAlarms(alertRes);
        } catch (error) {
          console.error('앱 로딩 중 알림 가져오기 실패:', error);
          // 여기서 에러 발생 시 로그아웃 처리 등을 할 수도 있습니다.
        }
      }
    };

    bootstrapAuth();
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

    // "낙관적 업데이트(Optimistic Update)":
    // API 응답을 기다리지 않고, 성공할 것이라 가정하고 화면을 즉시 변경합니다.
    // 사용자 경험(UX)이 매우 빨라지는 효과가 있습니다.
    setAlarms((prevAlarms) => ({
      ...prevAlarms,
      // items 배열에서 클릭한 alertId와 일치하는 항목을 제외하고 새 배열을 만듭니다.
      items: prevAlarms.items.filter((alert) => alert.item.id !== alertId),
    }));

    try {
      // 백그라운드에서 실제 서버에 읽음 처리 API를 조용히 호출합니다.
      await putAlerts(userId, alertId);
    } catch (error) {
      console.error('API - 알림 읽음 처리 실패:', error);
      // 참고: 여기서 API 요청이 실패했을 때, 위에서 제거했던 알림을 다시 목록에 복구하는
      // "롤백(rollback)" 로직을 추가하면 더욱 견고한 코드가 됩니다.
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
