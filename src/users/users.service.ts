import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(email: string, password: string): Promise<User> {
    const newUserWithId = {
      email,
      password,
    };
    return this.prismaService.user.create({
      data: newUserWithId,
    });
  }
}
