import axios from "axios";
import type { MaterialList } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

//원자재 호출
export const getMaterialData = async (): Promise<MaterialList[]> => {
  const response = await axios.get(`${BASE_URL}/material`);
  return response.data;
};
