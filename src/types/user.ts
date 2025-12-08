// src/types/user.ts
export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  // token is optional because /auth/me does not return it
  token?: string;
}
