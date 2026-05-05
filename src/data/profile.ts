import type { User } from '../types/auth';

// BUG: registeredAt uses DD/MM/YYYY format instead of ISO 8601 (YYYY-MM-DD)
export const MOCK_USER: User = {
  id: 'usr-001',
  name: 'María García',
  email: 'maria@example.com',
  registeredAt: '27/04/2024',
  avatarInitial: 'M',
};

/** Mock credentials — hardcoded for demo purposes */
export const MOCK_CREDENTIALS = {
  email: 'maria@example.com',
  password: 'demo1234',
};
