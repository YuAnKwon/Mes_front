import axios from "axios";
import type { MaterialOut } from "../type";
export const BASE_URL = import.meta.env.VITE_API_URL;

export const getMaterialData = async (): Promise<MaterialOut[]> => {
  const response = await axios.get(`${BASE_URL}/material/out`);
  return response.data;
};
