import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import { checkPasswordValidation } from '../utils/check-password-validation/check-password-validation';

type AccessToken = {
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<AccessToken> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordIsValid = await user.validatePassword(pass);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Inavalid password');
    }

    return this.generateAccessToken(user);
  }

  async register(register: Omit<User, 'id'>): Promise<AccessToken> {
    this.validatePassword(register.password);

    const user = await this.usersService.create(register);

    return this.generateAccessToken(user);
  }

  private async generateAccessToken(
    user: User,
  ): Promise<{ access_token: string }> {
    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private validatePassword(password: string): void {
    const errors = [];

    const isWhiteSpace = checkPasswordValidation.isWhiteSpace(password);
    if (isWhiteSpace) {
      errors.push(isWhiteSpace);
    }

    const isNotContainsUppercase =
      checkPasswordValidation.isContainsUppercase(password);
    if (isNotContainsUppercase) {
      errors.push(isNotContainsUppercase);
    }

    const isNotContainsLowercase =
      checkPasswordValidation.isContainsLowercase(password);
    if (isNotContainsLowercase) {
      errors.push(isNotContainsLowercase);
    }

    const isNotContainsNumber =
      checkPasswordValidation.isContainsNumber(password);
    if (isNotContainsNumber) {
      errors.push(isNotContainsNumber);
    }

    const isNotContainsSymbol =
      checkPasswordValidation.isContainsSymbol(password);
    if (isNotContainsSymbol) {
      errors.push(isNotContainsSymbol);
    }

    const isNotValidLength = checkPasswordValidation.isValidLength(password);
    if (isNotValidLength) {
      errors.push(isNotValidLength);
    }

    if (errors.length) {
      throw new BadRequestException(errors);
    }
  }
}
