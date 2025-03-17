import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';

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
    @Body(new ValidationPipe()) registerDto: RegisterDto,
  ): Promise<any> {
    const user = await this.authService.createUser(
      registerDto.email,
      registerDto.password,
    );
    if (user) return { message: 'user created', user };
  }
}
