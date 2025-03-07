import { createContext, useContext } from "react";

interface UserContextType {
  user: any;
  setUser: (user: any) => void
}

export const UserContext = createContext<UserContextType | null>(null);


export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserContextProvider');
  }
  return context
}