import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const getMaterialInData = async () => {
  const response = await axios.get(`${BASE_URL}/material/in`);
  return response.data;
};
