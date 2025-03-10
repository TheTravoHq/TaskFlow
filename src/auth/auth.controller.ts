import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (user) return { message: 'login successfull', user };
  }

  @Post('/register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<any> {
    const user = await this.authService.createUser(email, password);
    if (user) return { message: 'user created', user };
  }
}
