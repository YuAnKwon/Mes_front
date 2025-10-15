import axios from "axios";
import type { MaterialInList, MaterialList } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

//원자재 호출
export const getMaterialData = async (): Promise<MaterialList[]> => {
  const response = await axios.get(`${BASE_URL}/material`);
  return response.data;
};

export const updateMaterialIn = async (
  id: number,
  data: Partial<MaterialInList>
) => {
  const response = await axios.put(`${BASE_URL}/material/in/${id}`, data);
  return response.data;
};

export const softDeleteMaterialIn = (id: number) => {
  return axios.delete(`${BASE_URL}/material/in/${id}`);
};
