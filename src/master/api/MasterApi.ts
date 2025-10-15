import axios from "axios";
import type { MasterCpList, MasterCpRegister, MasterOrItList, MasterOrItRegister } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

/* 수주대상품목 */
export const getMasterOrItList = async (): Promise<MasterOrItList[]> => {
  const response = await axios.get(`${BASE_URL}/master/orderitem/list`);
  console.log(response.data);
  return response.data;
};

export const registerOrderItem = async (data: MasterOrItRegister) => {
  const response = await axios.post(`${BASE_URL}/master/orderitem/register`, data);
  return response.data;
};

/* 업체 */
export const getMasterCpList = async (): Promise<MasterCpList[]> => {
  const response = await axios.get(`${BASE_URL}/master/company/list`);
  console.log(response.data);
  return response.data;
};

export const registerCompany = async (data: MasterCpRegister) => {
  const response = await axios.post(`${BASE_URL}/master/company/register`, data);
  return response.data;
};