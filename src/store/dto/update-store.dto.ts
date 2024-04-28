import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateStoreDto {
  @ApiProperty({
    example: 'Store name',
  })
  @IsNotEmpty({ message: 'Required field' })
  name: string;
}
