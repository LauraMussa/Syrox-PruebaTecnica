import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/Auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.repeatPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new BadRequestException('El email ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Credenciales invalidas');
    }

    const correctPassword = await bcrypt.compare(dto.password, user.password);
    if (!correctPassword) {
      throw new BadRequestException('Credenciales invalidas');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        name: user.name,
        id: user.id,
        email: user.email,
      },
    };
  }
}
