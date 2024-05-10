export interface UpdateBillboardDataModel extends UpdateBillboardModel {
  userId: string;
}

export interface UpdateBillboardModel {
  id: string;
  storeId: string;
  label: string;
  imageUrl: string;
}
