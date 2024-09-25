import { PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  /**
   * @description este parametro recibe el nombre como un string de minimo 3 caracteres
   * @example "Adan"
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  /**
   * @description este parametro recibe el email como un string
   * @example "adan@gmail.com"
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * @description este parametro recibe la password como un string de 8 a 15 caracteres que debe contener letras entre mayuscula y minuscula, numeros y simbolos
   * @example "Example123#"
   */
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @MinLength(8)
  @MaxLength(15)
  password: string;

  /**
   * @description este parametro recibe la direccion como un string de maximo 80 caracteres
   * @example "calle 1 carrera 1"
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  /**
   * @description este parametro recibe el celular como un number de 10 numeros
   * @example 3001112233
   */
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  /**
   * @description este parametro recibe el pais como un string de minimo 5 y maximo 20 caracteres
   * @example "Pais"
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country: string;

  /**
   * @description este parametro recibe la ciudad como un string de minimo 5 y maximo 20 caracteres
   * @example "Bogota"
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city: string;
}

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
