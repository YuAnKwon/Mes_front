import axios from "axios";
import type { MaterialList } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const getMaterialInData = async (): Promise<MaterialList[]> => {
  const response = await axios.get(`${BASE_URL}/material/in`);
  return response.data;
};

export const postMaterialInData = async (data: MaterialList[]) => {
  const response = await axios.post(`${BASE_URL}/material/in`, data);
  return response.data;
};
