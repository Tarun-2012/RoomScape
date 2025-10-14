"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, loginWithGoogle, logout as firebaseLogout } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  skip: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const skip = localStorage.getItem("skipLogin");
      if (firebaseUser) {
        setUser(firebaseUser);
      } else if (skip === "true") {
        setUser({
          uid: "guest",
          displayName: "Guest User",
          email: "guest@local",
          providerData: [],
        } as unknown as User);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    await loginWithGoogle();
    localStorage.removeItem("skipLogin");
  };

  const skip = () => {
    localStorage.setItem("skipLogin", "true");
    setUser({
      uid: "guest",
      displayName: "Guest User",
      email: "guest@local",
      providerData: [],
    } as unknown as User);
  };

  const logout = async () => {
    await firebaseLogout();
    localStorage.removeItem("skipLogin");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, skip, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
