import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateBillboardDto {
  @ApiProperty({
    example: 'Billboard label',
  })
  @IsNotEmpty({ message: 'Required field' })
  label: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
  })
  @IsNotEmpty({ message: 'Required field' })
  @IsUrl({}, { message: 'Invalid URL' })
  imageUrl: string;
}
