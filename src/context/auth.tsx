import { createContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import Loading from "../components/Loading/Loading";

interface User {
  // Define your user properties here
  uid: string | null;
  email: string | null;
  name?: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<{ user: User | null }>({ user: null });

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }

      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
