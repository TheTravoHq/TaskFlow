import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.userService.findUserByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password: _, ...result } = user;
    return result;
  }

  async createUser(email: string, password: string): Promise<any> {
    const user = this.userService.findUserByEmail(email);
    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    const newUserWithId = await this.userService.createUser(email, password);
    const { password: _, ...result } = newUserWithId;
    return result;
  }
}
