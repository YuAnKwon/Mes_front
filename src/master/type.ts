/* 수주품목대상 */
export type MasterOrderItem = {
  itemCode: string;//품목번호
  itemName: string;//품목명
  company: string;//거래처명
  type: string;//분류
  unitPrice: number;//품목단가
  color: string;//색상
  coatingMethod: string;//도장방식
  remark: string;//비고
}

//수주품목대상 등록 조회
export type MasterOrItList = MasterOrderItem & {
  id: number;
  completedStatus: string;//거래상태
}

//수주품목대상 등록
export type MasterOrItRegister = MasterOrderItem & {
  id: number;
  imgUrl: File[];
  routing: string[];
};



/* 원자재 */
export type MasterMaterial = {
  itemCode: string;//품목번호
  itemName: string;//품목명
  company: string;//매입처명
  type: string;//분류
  color: string;//색상
  remark: string;//비고
}

//원자재 조회
export type MasterMtList = MasterMaterial & {
  id: number;
  completedStatus: string;//거래상태
}

//원자재 등록
export type MasterMtRegister = MasterMaterial & {
  id: number;
  spec: number;//규격
  scale: string;//규격단위
  manufacturer: string;//제조사
}



/* 업체 */
export type MasterCompany ={
  companyName: string;//거래처명
  companyType: string;//업체유형
  ceoName: string;//대표명
  address: string;//기업주소
  remark: string;//비고
}

//업체 조회
export type MasterCpList = MasterCompany & {
  id: number;
  businessYn: string;//거래상태 
}

//업체 등록
export type MasterCpRegister = MasterCompany & {
  id: number;
  companyName: number;//사업자 등록번호 
  ceoPhone: number;//대표 전화번호 
  managerName: string;//담당자 
  managerPhone: number;//담당자 전화번호 
  managerEmail: string;//담당자 이메일 
}



/* 라우팅 */
export type MasterRouting ={
  processCode: number;// 공정코드
  processName: string;// 공정명
  processTime: number;// 공정시간
  remark: string;// 비고
}


