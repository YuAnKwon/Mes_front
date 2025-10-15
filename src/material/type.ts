export type MaterialList = {
  id: number;
  materialName: string;
  materialCode: string;
  companyName: string;

  manufacturer: string;
  remark: string;
  idDate: string;
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
