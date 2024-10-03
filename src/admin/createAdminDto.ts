import { PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPasswordAdmin.decorator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @Matches(/^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, {
    message: 'El email debe tener un formato válido',
  })
  email: string;

  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsNumber()
  phone: number;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  passwordConfirmation: string;
}
export class LoginAdminDTO extends PickType(CreateAdminDto, [
  'email',
  'password',
]) {}
