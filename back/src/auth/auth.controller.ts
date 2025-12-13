import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/Auth.dto';
import type { Response } from 'express';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
  };
}

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea un nuevo usuario administrador en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente (sin password).',
  })
  @ApiResponse({
    status: 400,
    description: 'El email ya está en uso o datos inválidos.',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Valida credenciales y devuelve un JWT para acceso.',
  })
  @ApiResponse({
    status: 201,
    description: 'Login exitoso. Devuelve token y datos básicos.',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales incorrectas (Email o Password).',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
    });
    return { message: 'Login exitoso', user: result.user };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('access_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0), 
      path: '/',
    });

    return { message: 'Sesión cerrada exitosamente' };
  }
}
