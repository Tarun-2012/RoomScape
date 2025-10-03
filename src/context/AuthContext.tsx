// src/context/AuthContext.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, loginWithGoogle, logout } from "@/lib/firebase";  // ✅ import here
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login: loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
