import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

type UserRole = 'employer' | 'employee' | null;

interface AlarmType { 
  item: {
    id: string;                                 // 가게 id
    createdAt: string;                          // 생성 일시 (ISO 8601 문자열) 
    result: 'accepted' | 'rejected';            // 결과 상태 
    read: boolean;                              // 읽음 여부 
    shop: {
      item: {
        name: string;                           // 가게 이름
      };
    };
    notice: {
      item: {
        startsAt: string;                       // 근무 시작 시간 (ISO 8601 문자열) 
        workhour: number;                       // 근무 시간 (시간 단위) 
      };
    };
  };
}

interface AlarmInfo {
  count: number;
  items: AlarmType[];
}

interface AuthContextType {
  isLoggedIn: boolean;                          // 로그인 여부
  role: UserRole;                               // 알바님, 사장님 구분
  alarms: AlarmInfo;                            // 알림 리스트
  logout: () => void;                           // 로그아웃 함수
}

const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  role: null,
  alarms: {count: 0, items:[]},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [alarms, setAlarms] = useState<AlarmInfo>(defaultAuthContext.alarms);

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setAlarms(defaultAuthContext.alarms);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, alarms, logout }}>
      {children}
    </AuthContext.Provider>
  );
}