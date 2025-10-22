import axios from "axios";
import type { MasterCpList, MasterCpRegister } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

/* 업체 */
export const getMasterCpList = async (): Promise<MasterCpList[]> => {
  const response = await axios.get(`${BASE_URL}/master/company/list`);
  return response.data;
};

/* 거래처 조회 */
export const getClientList = async (): Promise<MasterCpList[]> => {
  const response = await axios.get(`${BASE_URL}/master/company/list/client`);
  return response.data;
};

/* 매입처 조회 */
export const getSupplierList = async (): Promise<MasterCpList[]> => {
  const response = await axios.get(`${BASE_URL}/master/company/list/supplier`);
  return response.data;
};

export const registerCompany = async (data: MasterCpRegister) => {
  const response = await axios.post(
    `${BASE_URL}/master/company/register`,
    data
  );
  return response.data;
};

export const updateCompanyState = async (id: number, updatedState: string) => {
  const response = await axios.patch(`${BASE_URL}/master/company/${id}/state`, {
    updatedState,
  });
  return response.data;
};

export const getCompanyDetail = async (id: number) => {
  const response = await axios.get(`${BASE_URL}/master/company/detail/${id}`);
  console.log(response.data);
  return response.data;
};

export const updateCompanyDetail = async (
  id: number,
  updatedCompany: MasterCpRegister
) => {
  const response = await axios.put(
    `${BASE_URL}/master/company/detail/${id}`,
    updatedCompany
  );
  return response.data;
};
