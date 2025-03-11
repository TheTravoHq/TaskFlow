import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailValidationPipe } from './pipes/email-validation.pipe';
import { PasswordValidationPipe } from './pipes/password-validation.pipe';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req): Promise<any> {
    return await this.authService.login(req?.user);
  }

  @Post('/register')
  async register(
    @Body('email', EmailValidationPipe) email: string,
    @Body('password', PasswordValidationPipe) password: string,
  ): Promise<any> {
    const user = await this.authService.createUser(email, password);
    if (user) return { message: 'user created', user };
  }
}
