/* 수주품목대상 */
//수주품목대상 등록 조회
export type MasterOrItList = {
  id: number;
  itemCode: string; //품목번호
  itemName: string; //품목명
  company: string; //거래처명
  type: string; //분류
  unitPrice: number; //품목단가
  color: string; //색상
  coatingMethod: string; //도장방식
  remark: string; //비고
  useYn: string; //거래상태
};

//수주품목대상 등록
export type MasterOrItRegister = {
  id?: number;
  itemCode: string; //품목번호
  itemName: string; //품목명
  company: string; //거래처명
  type: string; //분류
  unitPrice: number; //품목단가
  color: string; //색상
  coatingMethod: string; //도장방식
  remark: string; //비고
  imgUrl: File[];
  routing: MasterRouting[];
};

/* 원자재 */

//원자재 조회
export type MasterMtList = {
  id: number;
  materialCode: string; //품목번호
  materialName: string; //품목명
  companyName: string; //매입처명
  type: string; //분류
  color: string; //색상
  useYn: string; //거래상태
  remark: string; //비고
};

//원자재 등록
export type MasterMtRegister = {
  id?: number;
  materialCode: string; //품목번호
  materialName: string; //품목명
  companyName: string; //매입처명
  type: string; //분류
  color: string; //색상
  spec: number; //규격
  scale: string; //규격단위
  manufacturer: string; //제조사
  remark: string; //비고
};

/* 업체 */

//업체 조회
export type MasterCpList = {
  id: number;
  companyName: string; //거래처명
  companyType: string; //업체유형
  ceoName: string; //대표명
  address: string;
  businessYn: string; //거래상태
  remark: string; //비고
};

//업체 등록
export type MasterCpRegister = {
  id?: number;
  companyName: string; //거래처명
  companyType: string; //업체유형
  businessNum: number; //사업자 등록번호
  ceoName: string; //대표명
  ceoPhone: number; //대표 전화번호
  managerName: string; //담당자
  managerPhone: number; //담당자 전화번호
  managerEmail: string; //담당자 이메일
  zipcode: number; //우편번호
  addressBase: string; //기업주소
  addressDetail: string; //기업주소 상세
  remark: string; //비고
};

/* 라우팅 */
export type MasterRouting = {
  id: number;
  processCode: string; // 공정코드
  processName: string; // 공정명
  processTime: number | undefined; // 공정시간
  remark: string; // 비고
};
