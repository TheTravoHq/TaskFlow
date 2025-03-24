import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyOtpDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // async login(@Req() req): Promise<any> {
  //   return await this.authService.login(req?.user);
  // }

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
