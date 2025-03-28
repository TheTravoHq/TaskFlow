import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyOtpDto } from './dto/register.dto';
import { LoginThrottlerGuard } from './guards/login-throttler.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LoginThrottlerGuard)
  @Post('/login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto): Promise<any> {
    return await this.authService.login(loginDto);
  }

  @Post('/verify-otp')
  async verifyOtp(
    @Body(new ValidationPipe()) verifyOtpDto: VerifyOtpDto,
  ): Promise<any> {
    return await this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('/register')
  async register(
    @Body(new ValidationPipe()) registerDto: RegisterDto,
  ): Promise<any> {
    const user = await this.authService.createUser(registerDto.email);
    if (user) return await this.authService.login(user);
  }
}
