import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';

export interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'Learner' | 'ContentCreator' | 'Admin' | string;
  expertiseArea?: string;
  profilePicture?: string;
  headline?: string;
  location?: string;
  about?: string;
  certificates?: Array<{ name: string; issuer?: string; issuedDate?: string; fileName?: string; fileType?: string; fileData?: string }> ;
  skills?: string[];
  education?: string;
  experience?: string;
  reputationScore?: number;
  isVerified?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  initializing: boolean;
  login: (data: unknown) => Promise<{ user: AuthUser; redirectTo?: string }>;
  demoLogin: () => void;
  register: (data: unknown) => Promise<{ user: AuthUser }>;
  requestRegisterOtp: (data: unknown) => Promise<unknown>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const extractUser = (data: any): AuthUser => data?.data?.user || data?.user || data?.data || data;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Never restore a cached user without an active session token.
    if (!localStorage.getItem('infonest_token')) {
      localStorage.removeItem('infonest_user');
      localStorage.removeItem('infonest_role');
      return null;
    }
    try { return JSON.parse(localStorage.getItem('infonest_user') || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const save = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem('infonest_user', JSON.stringify(u));
    else localStorage.removeItem('infonest_user');
  };

  const fetchUser = useCallback(async () => {
    if (!localStorage.getItem('infonest_token')) { setInitializing(false); return; }
    if (localStorage.getItem('infonest_token') === 'infonest-demo-session') { setInitializing(false); return; }
    try { save(extractUser((await authApi.me()).data)); }
    catch { localStorage.removeItem('infonest_token'); save(null); }
    finally { setInitializing(false); }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = async (data: unknown) => {
    // Prevent the previous account from remaining visible while a new login is performed.
    localStorage.removeItem('infonest_user');
    localStorage.removeItem('infonest_role');
    setUser(null);
    setLoading(true);
    try {
      const r = await authApi.login(data);
      const token = r.data?.data?.accessToken || r.data?.accessToken || r.data?.token;
      if (token) localStorage.setItem('infonest_token', token);
      const u = extractUser(r.data);
      save(u);
      return { user: u, redirectTo: r.data?.data?.redirectTo || r.data?.redirectTo };
    } finally { setLoading(false); }
  };

  const demoLogin = () => {
    const demoUser: AuthUser = { _id:'infonest-demo-user', id:'infonest-demo-user', name:'Aarav Demo', email:'learner@infonest.demo', phone:'9000000000', role:'Learner', profilePicture:'/infonest-logo.png', headline:'Curious learner · InfoNest Demo', location:'Bengaluru', about:'Exploring cybersecurity, cloud, and modern web development.', expertiseArea:'Cybersecurity', skills:['Networking','Web Security','React'], reputationScore:1840, isVerified:true };
    localStorage.setItem('infonest_token','infonest-demo-session');
    localStorage.setItem('infonest_role','student');
    save(demoUser);
  };

  const register = async (data: unknown) => {
    setLoading(true);
    try {
      const r = await authApi.register(data);
      const token = r.data?.data?.accessToken || r.data?.accessToken || r.data?.token;
      if (token) localStorage.setItem('infonest_token', token);
      const u = extractUser(r.data);
      save(u);
      return { user: u };
    } finally { setLoading(false); }
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    localStorage.removeItem('infonest_token');
    localStorage.removeItem('infonest_role');
    save(null);
  };

  return <AuthContext.Provider value={{ user, loading, initializing, login, demoLogin, register, requestRegisterOtp: authApi.requestRegisterOtp, logout, fetchUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
};
