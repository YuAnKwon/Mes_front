import axios from "axios";
import type { OrderItemList, OrderItemInRegister } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const getOrderItemInRegiList = async (): Promise<OrderItemList[]> => {
  const response = await axios.get(`${BASE_URL}/orderitem/in/regi/list`);
  console.log(response.data);
  return response.data;
};

export const registerInboundItem = async (data: OrderItemInRegister[]) => {
  const response = await axios.post(`${BASE_URL}/orderitem/in/register`, data);
  return response.data;
};

export const getOrderItemInList = async (): Promise<OrderItemList[]> => {
  const response = await axios.get(`${BASE_URL}/orderitem/in/list`);
  console.log(response.data);
  return response.data;
};

export const getOrderItemOutRegiList = async (): Promise<OrderItemList[]> => {
  const response = await axios.get(`${BASE_URL}/orderitem/out/regi/list`);
  console.log(response.data);
  return response.data;
};
