import axios from "axios";
import type { MasterRouting } from "../type";
import { BASE_URL } from "./OrderItemApi";

export const getRoutingList = async (): Promise<MasterRouting[]> => {
  const response = await axios.get(`${BASE_URL}/routing/list`);
  console.log(response.data);
  return response.data;
};

export const newRouting = async (data: MasterRouting[]) => {
  const response = await axios.post(`${BASE_URL}/routing/new`, data);
  return response.data;
};

export const deleteRouting = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/routing/${id}`);
  return response.data;
};
