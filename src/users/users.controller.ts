import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JWTAuthGuard)
  @Get('/profile')
  profile(@Req() req: any) {
    const { password, ...result } = req.user;
    return result;
  }

  @UseGuards(JWTAuthGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
