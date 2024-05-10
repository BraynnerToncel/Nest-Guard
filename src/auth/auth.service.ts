import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ name, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByemal(email);
    if (user) {
      throw new BadRequestException('User al ready exists');
    }
    return await this.usersService.create({
      email,
      password: await bcryptjs.hash(password, 10),
      name,
    });
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByemal(email);
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }
    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      email,
    };
  }
}
