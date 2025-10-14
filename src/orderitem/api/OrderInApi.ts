import axios from "axios";
import type { OrderItemInList, OrderItemInRegister } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const getOrderItemInRegiList = async (): Promise<OrderItemInList[]> => {
  const response = await axios.get(`${BASE_URL}/orderitem/in/regi/list`);
  console.log(response.data);
  return response.data;
};

export const registerInboundItem = async (data: OrderItemInRegister[]) => {
  const response = await axios.post(`${BASE_URL}/orderitem/in/register`, data);
  return response.data;
};
