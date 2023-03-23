import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Length, IsString, Matches } from 'class-validator';

export class CreateUsersDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(0, 20)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(0, 20)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches('(?=.*[a-z])[a-zA-Z0-9]{8,}')
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  register_token?: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches('(?=.*[a-z])[a-zA-Z0-9]{8,}')
  password: string;

  @ApiProperty()
  @Matches('password')
  @IsString()
  @IsNotEmpty()
  rePassword: string;
}

export class PreResetPasswordDto {
  @ApiProperty({
    example: 'abc@gmail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
