import { User, InsertUser } from '@shared/schema';
import { LocalStorage, STORAGE_KEYS } from './storage';

export class AuthService {
  static getCurrentUser(): User | null {
    return LocalStorage.get<User | null>(STORAGE_KEYS.USER, null);
  }

  static login(email: string, password: string): { success: boolean; message?: string; user?: User } {
    const users = LocalStorage.get<Array<User & { password: string }>>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      LocalStorage.set(STORAGE_KEYS.USER, userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid email or password' };
  }

  static signup(userData: InsertUser): { success: boolean; message?: string; user?: User } {
    const users = LocalStorage.get<Array<User & { password: string }>>(STORAGE_KEYS.USERS, []);
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      fullName: userData.fullName,
      password: userData.password,
      joinDate: new Date().getFullYear(),
    };

    users.push(newUser);
    LocalStorage.set(STORAGE_KEYS.USERS, users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    LocalStorage.set(STORAGE_KEYS.USER, userWithoutPassword);
    
    return { success: true, user: userWithoutPassword };
  }

  static logout(): void {
    LocalStorage.remove(STORAGE_KEYS.USER);
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
