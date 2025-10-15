export type MaterialList = {
  id: number;
  materialName: string;
  materialCode: string;
  companyName: string;

  manufacturer: string;
  remark: string;
  inDate: string;
  specAndScale: string;
  manufactureDate: string;
  inAmount: string;
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
  inDate: string;
  manufactureDate: string;
};

export type MaterialOut = {
  materialName: string;
  materialCode: string;
  companyName: string;
  inAmount: number;
  manufacturer: string;
  outAmount: number;
  outDate: string;
};
