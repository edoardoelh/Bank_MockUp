import { useState, useCallback } from 'react';
import type { User, Credentials } from '../types/auth';
import { MOCK_USER, MOCK_CREDENTIALS } from '../data/profile';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (credentials: Credentials) => boolean;
  logout: () => void;
}

/**
 * Mock authentication hook.
 * Validates credentials against hardcoded demo values.
 * Returns false if credentials don't match, true on success.
 */
export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = useCallback((credentials: Credentials): boolean => {
    if (
      credentials.email === MOCK_CREDENTIALS.email &&
      credentials.password === MOCK_CREDENTIALS.password
    ) {
      setState({ user: MOCK_USER, isAuthenticated: true });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, isAuthenticated: false });
  }, []);

  return { ...state, login, logout };
}
