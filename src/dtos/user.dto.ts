import { PickType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
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
  @Matches(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: 'La fecha debe estar en formato YYYY-MM-DD',
  })
  birthDate: Date;
}

export class LoginUserDTO extends PickType(CreateUserDTO, [
  'email',
  'password',
]) {}
