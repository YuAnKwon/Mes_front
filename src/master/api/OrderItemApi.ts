import axios from "axios";
import type { MasterOrItList, MasterOrItRegister } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

/* 수주대상품목 */
export const getMasterOrItList = async (): Promise<MasterOrItList[]> => {
  const response = await axios.get(`${BASE_URL}/master/orderitem/list`);
  console.log(response.data);
  return response.data;
};

// export const registerOrderItem = async (data: MasterOrItRegister) => {
//   const response = await axios.post(
//     `${BASE_URL}/master/orderitem/register`,
//     data
//   );
//   return response.data;
// };

export const registerOrderItem = async (data: MasterOrItRegister) => {
  const formData = new FormData();

  // JSON 데이터 따로 추가
  const json = JSON.stringify({
    itemCode: data.itemCode,
    itemName: data.itemName,
    company: data.company,
    type: data.type,
    unitPrice: data.unitPrice,
    color: data.color,
    coatingMethod: data.coatingMethod,
    remark: data.remark,
  });
  formData.append("data", new Blob([json], { type: "application/json" }));

  // 파일 추가
  data.imgUrl.forEach((file) => formData.append("imgUrl", file));

  return axios.post(`${BASE_URL}/master/orderitem/register`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateOrItState = async (id: number, updatedState: string) => {
  const response = await axios.patch(
    `${BASE_URL}/master/orderitem/${id}/state`,
    { updatedState }
  );
  return response.data;
};

export const getOrItDetail = async (id: number) => {
  const response = await axios.get(`${BASE_URL}/master/orderitem/detail/${id}`);
  return response.data;
};

export const updateOrItDetail = async (
  id: number,
  updatedMaterial: MasterOrItRegister
) => {
  const response = await axios.put(
    `${BASE_URL}/master/orderitem/detail/${id}`,
    updatedMaterial
  );
  return response.data;
};
