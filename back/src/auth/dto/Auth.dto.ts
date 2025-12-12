import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Matches(/.*[a-z].*/, {
    message: 'La contraseña debe contener al menos una letra minúscula',
  })
  @Matches(/.*[A-Z].*/, {
    message: 'La contraseña debe contener al menos una letra mayúscula',
  })
  @Matches(/.*\d.*/, {
    message: 'La contraseña debe contener al menos un número',
  })
  @Matches(/.*[@$!%*?&].*/, {
    message:
      'La contraseña debe contener al menos un carácter especial (@$!%*?&)',
  })
  password: string;

  @IsString()
  repeatPassword: string; 
  
}

export class LoginDto {
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsString()
  password: string;
}
