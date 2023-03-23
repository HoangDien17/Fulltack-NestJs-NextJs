import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(0, 30)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  password: string;
}
