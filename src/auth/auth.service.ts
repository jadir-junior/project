import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';

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
}
