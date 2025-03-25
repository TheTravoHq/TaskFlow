import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto, VerifyOtpDto } from './dto/register.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private transporter: any;
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password', // Use App Password if 2FA enabled
      },
    });
  }

  async validateUser(email: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
  async validateUserById(userId: number): Promise<any> {
    return await this.userService.findUserById(userId);
  }
  async login({ email }: LoginDto): Promise<any> {
    return await this.sendOtp({ email });
  }

  async sendOtp({ email }: LoginDto) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prismaService.otp.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      },
    });

    // TODO: Use MailerService to send code via email
    console.log(`OTP for ${email}: ${otp}`);
  }

  async verifyOtp({ email, otp }: VerifyOtpDto): Promise<any> {
    const otpRecord = await this.prismaService.otp.findFirst({
      where: {
        email,
        otp,
        verified: false,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark as verified
    await this.prismaService.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    const userWithId = await this.createUser(email);
    const payload = { email: userWithId.email, sub: userWithId.id };

    //Generate JWT
    return {
      access_token: this.jwtService.sign(payload),
      message: 'login successful',
    };
  }

  async createUser(email: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      return user;
    }

    const newUserWithId = await this.userService.createUser(email);
    return newUserWithId;
  }
}
