import axios from "axios";
import type { MasterOrItList, MasterOrItRegister } from "../type";

export const BASE_URL = import.meta.env.VITE_API_URL;

/* 수주대상품목 */
export const getMasterOrItList = async (): Promise<MasterOrItList[]> => {
  const response = await axios.get(`${BASE_URL}/master/orderitem/list`);
  console.log(response.data);
  return response.data;
};

export const registerOrderItem = async (data: MasterOrItRegister) => {
  const formData = new FormData();

  //입력한 필드를 하나의 JSON 문자열 데이터로 직렬화
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
  //JSON을 data라는 파트로 넣음. 서버(백앤드?)에서 @RequestPart("data")로 받음.
  formData.append("data", new Blob([json], { type: "application/json" }));

  //업로드할 파일들을 같은 파트명 imgUrl으로 여러번 FormData에 추가(파일 리스트 전송).
  data.imgUrl.forEach((file) => formData.append("imgUrl", file));

  //서버의 등록 엔드포인트(?)로 multipart 형식으로 POST 요청 전송.
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
  const response = await axios.get(
    `${BASE_URL}/master/orderitem/detail/${id}`,
    {
      headers: {
        // 꼭 필요한 헤더만 추가.요청 파라미터가 너무 길어서 제한 하는 거임.
        "Content-Type": "application/json",
        // "Authorization": "Bearer ..." // 필요한 경우만
      },
    }
  );
  return response.data;
};

//api 바꿔보기
export const updateOrItDetail = (id: number, formData: FormData) => {
  return axios.put(`/api/master/orderitem/detail/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteImage = async (imageId: number) => {
  return axios.delete(`${BASE_URL}/master/orderitem/detail/image/${imageId}`);
};
