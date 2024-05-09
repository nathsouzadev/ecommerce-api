import { PartialType } from '@nestjs/swagger';
import { CreateBillboardDto } from './create-billboard.dto';

export class UpdateBillboardDto extends PartialType(CreateBillboardDto) {}
