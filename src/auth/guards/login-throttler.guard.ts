import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected generateKey(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const email = request.body?.email;
    return `login_${email || request.ip}`; // prefix with 'login_' to make it unique
  }
}
