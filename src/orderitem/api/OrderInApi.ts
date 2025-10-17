import axios from "axios";
import type {
  OrderItemList,
  OrderItemInRegister,
  OrderItemOutRegister,
  ShipInvoice,
  ProcessStatus,
} from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

// 입고 등록
export const getOrderItemInRegiList = async (): Promise<OrderItemList[]> => {
  const response = await axios.get(`${BASE_URL}/orderitem/in/regi/list`);
  console.log(response.data);
  return response.data;
};

export const registerInboundItem = async (data: OrderItemInRegister[]) => {
  const response = await axios.post(`${BASE_URL}/orderitem/in/register`, data);
  return response.data;
};

// 입고 조회, 출고등록페이지
export const getOrderItemInList = async (): Promise<OrderItemList[]> => {
  const response = await axios.get(`${BASE_URL}/orderitem/in/list`);
  console.log(response.data);
  return response.data;
};

// 입고 데이터 수정
export const updateOrderItemIn = async (
  id: number,
  data: { inAmount: number; inDate: string }
) => (await axios.put(`${BASE_URL}/orderitem/in/${id}`, data)).data;

// 입고 데이터 삭제
export const deleteOrderItemIn = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/orderitem/in/${id}`);
  return response.data;
};

// 출고 등록
export const registeroutboundItem = async (data: OrderItemOutRegister[]) => {
  const response = await axios.post(`${BASE_URL}/orderitem/out/register`, data);
  return response.data;
};

// 출고 조회
export const getOrderItemOutList = async (): Promise<OrderItemList[]> => {
  const response = await axios.get(`${BASE_URL}/orderitem/out/list`);
  console.log(response.data);
  return response.data;
};

// 출고 데이터 수정
export const updateOrderItemOut = async (
  id: number,
  data: { outAmount: number; outDate: string }
) => (await axios.put(`${BASE_URL}/orderitem/out/${id}`, data)).data;

// 출고 데이터 삭제
export const deleteOrderItemOut = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/orderitem/out/${id}`);
  return response.data;
};

// 공정 진행현황 조회
export const getProcessStatus = async (
  id: number
): Promise<ProcessStatus[]> => {
  const response = await axios.get(`${BASE_URL}/orderitem/process/${id}`);
  console.log(response.data);
  return response.data;
};

// 공정 진행현황 수정 & 시작시간 수정
export const updateProcessStatus = async (
  id: number,
  data: { startTime: string; processStatus: string }
) => (await axios.put(`${BASE_URL}/orderitem/process/${id}`, data)).data;

// 출하증
export const getShip = async (id: number): Promise<ShipInvoice[]> => {
  const response = await axios.get(`${BASE_URL}/orderitem/ship/${id}`);
  console.log(response.data);
  return response.data;
};
