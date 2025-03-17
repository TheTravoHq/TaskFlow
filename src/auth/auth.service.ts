import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password: _, ...result } = user;
    return result;
  }
  async validateUserById(userId: number): Promise<any> {
    return await this.userService.findUserById(userId);
  }
  async login(user: any): Promise<any> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      message: 'login successful',
    };
  }

  async createUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    const newUserWithId = await this.userService.createUser(email, password);
    const { password: _, ...result } = newUserWithId;
    return result;
  }
}
