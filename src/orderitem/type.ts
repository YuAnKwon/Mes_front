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

// 공정 진행현황
export type ShipInvoice = {
  id: number; // 수주 입출고 id
  companyName: string; // 거래처명
  outNum: string; // 출고번호
  inDate: string; // 입고일자
  outDate: string; // 출고일자
  companyAddr: string; // 거래처 주소
  itemCode: string; // 품목번호
  itemName: string; // 품목명
  outAmount: number; // 출고수량
};

export type ProcessStatus = {
  id: number; // 수추입출고 라우팅 id
  routingOrder: number;
  processCode: string;
  processName: string;
  processTime: number;
  remark: string;
  completedStatus: string;
  startTime?: string | Date | null;
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
