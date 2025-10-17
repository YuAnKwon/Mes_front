import axios from "axios";
import type { MaterialTotalStock } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const getMaterialTotalStock = async (): Promise<
  MaterialTotalStock[]
> => {
  const response = await axios.get(`${BASE_URL}/material/totalstock`);
  return response.data;
};
