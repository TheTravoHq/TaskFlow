import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth-guard';

@Controller('users')
export class UsersController {
  constructor() {}

  @UseGuards(JWTAuthGuard)
  @Get('/profile')
  profile(@Req() req: any) {
    const { password, ...result } = req.user;
    return result;
  }
}
