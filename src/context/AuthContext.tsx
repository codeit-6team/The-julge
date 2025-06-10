import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type UserRole = 'employer' | 'employee' | null;

interface AlarmType {
  id: string                                    // 공고 id
  status: 'accepted' | 'rejected';              // 공고 지원 상태
  restaurantName: string;                       // 음식점 이름 
  startsAt: string;                             // 공고 시작 시간 (ISO 8601 문자열)
  workHour: number;                             // 근무 시간 (시간 단위) 
  createdAt: string;                            // 알림 생성 시간 (ISO 8601 문자열) 
}

interface AuthContextType {
  isLoggedIn: boolean;                          // 로그인 여부
  role: UserRole;                               // 알바님, 사장님 구분
  alarms: AlarmType[];                          // 알림 리스트
  logout: () => void;                           // 로그아웃 함수
}

const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  role: null,
  alarms: [],
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [alarms, setAlarms] = useState<AlarmType[]>([]);

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setAlarms([]);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, alarms, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
