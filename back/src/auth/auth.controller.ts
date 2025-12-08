import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; 
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/Auth.dto';


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
    description: 'Crea un nuevo usuario administrador en el sistema.' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente (sin password).' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'El email ya está en uso o datos inválidos.' 
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión', 
    description: 'Valida credenciales y devuelve un JWT para acceso.' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Login exitoso. Devuelve token y datos básicos.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales incorrectas (Email o Password).' 
  })
  login(@Body() loginDto: LoginDto) { // Puedes tipar el retorno como Promise<LoginResponse> si quieres
    return this.authService.login(loginDto);
  }
}
