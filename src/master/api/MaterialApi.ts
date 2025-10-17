import axios from "axios";
import type {  MasterMtList, MasterMtRegister } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

/* 업체 */
export const getMasterMtList = async (): Promise<MasterMtList[]> => {
  const response = await axios.get(`${BASE_URL}/master/material/list`);
  console.log(response.data);
  return response.data;
};

export const registerMaterial = async (data: MasterMtRegister) => {
  const response = await axios.post(`${BASE_URL}/master/material/register`, data);
  return response.data;
};

export const updateMaterialState = async (id: number, updatedState: string) => {
  const response = await axios.patch(`${BASE_URL}/master/material/${id}/state`, {updatedState});
  return response.data;
};

export const getMaterialDetail = async (id: number) => {
  const response = await axios.get(`${BASE_URL}/master/material/detail/${id}`);
  console.log(response.data);
  return response.data;
};

export const updateMaterialDetail = async (id: number, updatedMaterial: string) => {
  const response = await axios.put(`${BASE_URL}/master/material/detail/${id}`, updatedMaterial);
  return response.data;
};