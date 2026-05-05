export interface Credentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  /** BUG: stored as DD/MM/YYYY string but should be ISO 8601 */
  registeredAt: string;
  avatarInitial: string;
}
