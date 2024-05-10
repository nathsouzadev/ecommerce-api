import { CreateBillboardDto } from '../dto/create-billboard.dto';

export interface NewBillboardDataModel extends CreateBillboardDto {
  storeId: string;
}

export interface NewBillboardModel extends NewBillboardDataModel {
  userId: string;
}
