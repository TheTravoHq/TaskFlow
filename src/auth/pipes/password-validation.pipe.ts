import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  transform(value: any) {
    console.log('PasswordValidationPipe', value);

    if (value.length < 1) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }
    return value;
  }
}
