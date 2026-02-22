"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  userId: string;
  role: string;
  setUser: (id: string, role: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>("");
  const [role, setRole] = useState<string>("");

  // 🔥 Carregar do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("taskflow_user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed.userId);
      setRole(parsed.role);
    }
  }, []);

  // 🔥 Guardar no localStorage sempre que mudar
  const setUser = (id: string, role: string) => {
    setUserId(id);
    setRole(role);

    localStorage.setItem(
      "taskflow_user",
      JSON.stringify({ userId: id, role })
    );
  };

  return (
    <AuthContext.Provider value={{ userId, role, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
