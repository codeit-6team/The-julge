import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // 'employer' | 'employee'
  const [alarms, setAlarms] = useState([]);

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
