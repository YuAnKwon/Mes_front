import axios from "axios";
import type { MaterialOutList } from "../type";
export const BASE_URL = import.meta.env.VITE_API_URL;

export const getMaterialOutDatas = async (): Promise<MaterialOutList[]> => {
  const response = await axios.get(`${BASE_URL}/material/out/list`);
  return response.data;
};

export const updateMaterialOut = async (
  id: number,
  data: Partial<MaterialOutList>
) => {
  const response = await axios.put(`${BASE_URL}/material/out/${id}`, data);
  return response.data;
};

export const softDeleteMaterialOut = (id: number) => {
  return axios.delete(`${BASE_URL}/material/out/${id}`);
};
