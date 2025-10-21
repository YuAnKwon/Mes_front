import axios from "axios";
import type { MasterOrItList } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

/* 수주대상품목 */
export const getMasterOrItList = async (): Promise<MasterOrItList[]> => {
  const response = await axios.get(`${BASE_URL}/master/orderitem/list`);
  console.log(response.data);
  return response.data;
};

// 기존 payload 받는 거 아니라 FormData를 바로 받도록
export const registerOrderItem = async (formData: FormData) => {
  return axios.post(`${BASE_URL}/master/orderitem/register`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateOrItState = async (id: number, updatedState: string) => {
  const response = await axios.patch(
    `${BASE_URL}/master/orderitem/${id}/state`,
    { updatedState }
  );
  return response.data;
};

export const getOrItDetail = async (id: number) => {
  const response = await axios.get(`${BASE_URL}/master/orderitem/detail/${id}`);
  return response.data;
};

//api 바꾸기
export const updateOrItDetail = (id: number, formData: FormData) => {
  return axios.put(`${BASE_URL}/master/orderitem/detail/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
