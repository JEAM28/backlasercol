import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';

export class CreateUserDTO {
  /**
   * Debe ser un string entre 3 y 50 caracteres
   */
  @ApiProperty({
    description: 'Nombre del usuario. Debe ser un string entre 3 y 50 caracteres.',
    example: 'Juan'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Matches(/^[A-Za-z]+( [A-Za-z]+)*$/)
  name: string;

  @ApiProperty({
    description: 'DNI del usuario. Debe ser un número de al menos 6 dígitos y maximo 16.',
    example: '12345678'
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(16)
  @Matches(/^[0-9]+$/, { message: 'El DNI solo puede contener números' })
  Dni: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario. Debe cumplir con el formato estándar de email.',
    example: 'juan.perez@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, {
    message: 'El email debe tener un formato válido',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario. Debe contener al menos una letra mayúscula, un número y un carácter especial.',
    example: 'Passw0rd!'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe contener una letra mayuscula, un número y un carácter especial.',
  })
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @ApiProperty({
    description: 'Confirmación de la contraseña. Debe coincidir con el campo "password".',
    example: 'Passw0rd!'
  })
  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  passwordConfirmation: string;

  @ApiProperty({
    description: 'Dirección del usuario. Debe ser un string entre 3 y 80 caracteres.',
    example: 'Av. Siempreviva 742'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario.',
    example: '5491155551234'
  })
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @ApiProperty({
    description: 'País de residencia del usuario. Debe ser un string entre 5 y 20 caracteres.',
    example: 'Argentina'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country: string;

  @ApiProperty({
    description: 'Ciudad de residencia del usuario. Debe ser un string entre 5 y 20 caracteres.',
    example: 'Buenos Aires'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario en formato ISO 8601.',
    example: '2000-01-01'
  })
  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString(), {
    toClassOnly: true,
  })
  birthDate: Date;
}
export class LoginUserDTO extends PickType(CreateUserDTO, [
  'email',
  'password',
]) {}


