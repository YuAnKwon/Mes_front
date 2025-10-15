export type OrderItemList = {
  id: number;
  lotNum?: number;
  outNum?: number;
  itemName: string;
  itemCode: string;
  company: string;
  type: string;
  inAmount?: number;
  inDate?: string;
  outAmount?: number;
  outDate?: string;
  remark?: string;
};

export type OrderItemInRegister = {
  id: number;
  inAmount: number;
  inDate: string;
};

export type OrderItemOutRegister = {
  id: number;
  outAmount: number;
  outDate: string;
};
