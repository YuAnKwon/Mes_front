export type MaterialList = {
  id: number;
  materialName: string;
  materialCode: string;
  companyName?: string;
  manufacturer?: string;
  inDate: string;
  specAndScale?: string;
  manufactureDate: string;
  inAmount: number;
};

export type MaterialInList = {
  id: number;
  inAmount: number;
  materialName: string;
  materialCode: string;
  companyName: string;
  specAndScale: string;
  scale: string;
  manufacturer: string;
  inDate: string | Date | null;
  manufactureDate: string | Date | null;
  inNum: string;
  totalStock: string;
};

export type MaterialOut = {
  inNum: string;
  outNum?: string;
  materialName: string;
  materialCode?: string;
  companyName?: string;
  inAmount?: number;
  manufacturer?: string;
  outAmount: number;
  outDate: string;
  stock?: number;
};

export type MaterialOutList = {
  id: number;
  inNum?: string;
  outNum: string;
  materialName: string;
  materialCode: string;
  companyName: string;
  inAmount?: number;
  manufacturer: string;
  outAmount: number;
  outDate: string | Date | null;
  stock?: number;
};

export type MaterialTotalStock = {
  materialId: number;
  materialName: string;
  materialCode: string;
  companyName: string;
  stock: number;
};
