import { RegisterDto } from './dto/register.dto';
import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
      throw new BadRequestException('user already exists');
    }
    return await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
    });
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByemal(email);
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('passwprd is wrong');
    }
    const payload = { email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      email,
    };
  }
  async profile({ email, role }: { email: string; role: string }) {
    if (role !== 'admin') {
      throw new UnauthorizedException('You are not authorized');
    }
    return await this.usersService.findOneByemal(email);
  }
}
