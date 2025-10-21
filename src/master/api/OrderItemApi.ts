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
    routing: data.routing,
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

//PUT으로 수정 요청을 보냄(현재는 multipart가 아닌 일반 객체 전송 형태여서 파일 포함 시 작동하지 않음).
export const updateOrItDetail = async (
  id: number,
  updatedMaterial: MasterOrItRegister
) => {
  //키/값 쌍을 담아 multipart 요청 본문으로 보낼 준비를 함.
  const formData = new FormData();

  // updatedMaterial의 key-value를 FormData에 추가
  Object.entries(updatedMaterial).forEach(([key, value]) => {
    if (value instanceof FileList) {
      // 파일이 여러 개라면 반복해서 추가
      Array.from(value).forEach((file) => formData.append(key, file));
    } else {
      formData.append(key, value as any);
    }
  });

  //서버의 등록 엔드포인트(?)로 multipart 형식으로 get 요청 전송.
  return axios.put(`${BASE_URL}/master/orderitem/detail/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
