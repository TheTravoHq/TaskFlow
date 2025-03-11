import { Injectable } from '@nestjs/common';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findUserByEmail(email: string): User | undefined {
    const user = this.users.find((user: User) => user.email === email);
    return user;
  }
  x;

  findUserById(id: number): User | undefined {
    const user = this.users.find((user: User) => user.id === id);
    return user;
  }

  async createUser(email: string, password: string): Promise<User> {
    const newUserWithId = {
      id: this.users.length + 1,
      email,
      password,
      createdAt: new Date(),
      updatedAt: null,
    };
    this.users.push(newUserWithId);
    return newUserWithId;
  }
}
