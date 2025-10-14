export type OrderItemInList = {
  id: number;
  itemName: string;
  itemCode: string;
  company: string;
  type: string;
  inAmount?: number;
  inDate?: string;
  remark: string;
};

export type OrderItemInRegister = {
  id: number;
  inAmount: number;
  inDate: string;
};
