import { createContext, useContext } from "react";
import { User } from "../types";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void
}

export const UserContext = createContext<UserContextType | null>(null);


export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserContextProvider');
  }
  return context
}