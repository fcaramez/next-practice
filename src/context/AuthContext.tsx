import { useRouter } from "next/router";
import {
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type AuthContextType = {
  user: {
    username: string;
    email: string;
    userId: string;
  } | null;
  isLoggedIn: boolean;
  storeToken: (token: string) => void;
  logout: () => void;
};

const defaultContextValues: AuthContextType = {
  user: null,
  isLoggedIn: false,
  logout: (): void => undefined,
  storeToken: (token: string): boolean => !!token,
};

const AuthContext = createContext<AuthContextType>(defaultContextValues);

export default function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{
    username: string;
    email: string;
    userId: string;
  } | null>(null);
  const router = useRouter();

  const storeToken = (token: string) => {
    if (!token) return;

    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  const value = {
    isLoggedIn,
    storeToken,
    logout,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
