import { PickType } from '@nestjs/swagger';
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
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-Z]+$/)
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^[0-9]+$/, { message: 'El DNI solo puede contener números' })
  Dni: string;

  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, {
    message: 'El email debe tener un formato válido',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe contener una letra mayuscula, un numero y un caracter especial.',
  })
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  passwordConfirmation: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city: string;

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
