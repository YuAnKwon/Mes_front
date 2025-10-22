import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import DaumPostcode from "react-daum-postcode";
import { useEffect, useState } from "react";
import { CloseIcon } from "flowbite-react";
import { Select } from "@mui/material";
import { getCompanyDetail, updateCompanyDetail } from "../api/companyApi";
import type { MasterCpRegister } from "../type";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface Props {
  companyId: number;
  onClose: (refresh?: boolean) => void; // refresh 옵션 추가
}

export default function MasterCompanyDetail({ companyId, onClose }: Props) {
  const [company, setCompany] = useState<MasterCpRegister>({
    companyName: "",
    companyType: "",
    businessNum: "",
    ceoName: "",
    ceoPhone: "",
    managerName: "",
    managerPhone: "",
    managerEmail: "",
    zipcode: "",
    addressBase: "",
    addressDetail: "",
    remark: "",
  });
  const [openPostcode, setOpenPostcode] = useState(false);

  //상세 정보 가져오기
  useEffect(() => {
    fetchCompanyDetail();
  }, [companyId]);

  const fetchCompanyDetail = async () => {
    try {
      const response = await getCompanyDetail(companyId); // ← API 호출

      // 상태에 기존 값 채워 넣기
      setCompany(response);
    } catch (error) {
      console.error("업체 정보 불러오기 실패:", error);
    }
  };

  const handleComplete = (data) => {
    //data는 주소 검색 전체 결과 객체
    setZipcode(data.zonecode);
    setAddressBase(data.address); // 기본 주소에 저장
    setOpenPostcode(false); // 검색창 닫기
  };

  const handleClickAddress = () => {
    setOpenPostcode(true);
  };

  const handleUpdate = async () => {
    try {
      await updateCompanyDetail(companyId, company);
      alert("업체 정보가 수정되었습니다");
      onClose(true); // true 전달 → 테이블 갱신
    } catch (error) {
      console.error(error);
      alert("수정 실패");
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {company.companyName}의 상세정보
      </Typography>

      <Box sx={{ height: 600, width: "100%" }}>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="companyName" required>
              업체명
            </FormLabel>
            <OutlinedInput
              id="companyName"
              name="companyName"
              value={company.companyName}
              onChange={(e) =>
                setCompany((prev) => ({ ...prev, companyName: e.target.value }))
              }
              type="text"
              placeholder="업체명"
              autoComplete="organization"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }} />
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="companyType" required>
              업체 유형
            </FormLabel>
            <Select
              id="companyType"
              name="companyType"
              value={company.companyType}
              onChange={(e) =>
                setCompany((prev) => ({ ...prev, companyType: e.target.value }))
              }
              displayEmpty
              input={<OutlinedInput />}
              size="small"
              required
              fullWidth
            >
              <MenuItem value="" disabled>
                업체 유형 선택
              </MenuItem>
              <MenuItem value="CLIENT">거래처</MenuItem>
              <MenuItem value="SUPPLIER">매입처</MenuItem>
            </Select>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="businessNum" required>
              사업자 등록번호
            </FormLabel>
            <OutlinedInput
              id="businessNum"
              name="businessNum"
              value={company.businessNum}
              onChange={(e) =>
                setCompany((prev) => ({ ...prev, businessNum: e.target.value }))
              }
              type="text"
              placeholder="사업자 등록번호"
              autoComplete="businessNum"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="ceoName" required>
              대표명
            </FormLabel>
            <OutlinedInput
              id="ceoName"
              name="ceoName"
              value={company.ceoName}
              onChange={(e) =>
                setCompany((prev) => ({ ...prev, ceoName: e.target.value }))
              }
              type="text"
              placeholder="홍길동"
              autoComplete="name"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="ceoPhone" required>
              대표 전화번호
            </FormLabel>
            <OutlinedInput
              id="ceoPhone"
              name="ceoPhone"
              value={company.ceoPhone}
              onChange={(e) =>
                setCompany((prev) => ({ ...prev, ceoPhone: e.target.value }))
              }
              type="text"
              placeholder="01012345678"
              autoComplete="tel"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="managerName" required>
              담당자명
            </FormLabel>
            <OutlinedInput
              id="managerName"
              name="managerName"
              value={company.managerName}
              onChange={(e) =>
                setCompany((prev) => ({ ...prev, managerName: e.target.value }))
              }
              type="text"
              placeholder="홍길동"
              autoComplete="name"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="managerPhone" required>
              담당자 전화번호
            </FormLabel>
            <OutlinedInput
              id="managerPhone"
              name="managerPhone"
              value={company.managerPhone}
              onChange={(e) =>
                setCompany((prev) => ({
                  ...prev,
                  managerPhone: e.target.value,
                }))
              }
              type="text"
              placeholder="01012345678"
              autoComplete="managerPhone"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="managerEmail" required>
              담당자 이메일
            </FormLabel>
            <OutlinedInput
              id="managerEmail"
              name="managerEmail"
              value={company.managerEmail}
              onChange={(e) =>
                setCompany((prev) => ({
                  ...prev,
                  managerEmail: e.target.value,
                }))
              }
              type="email"
              placeholder="example@gmail.com"
              autoComplete="email"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="remark">비고</FormLabel>
            <OutlinedInput
              id="remark"
              name="remark"
              value={company.remark}
              onChange={(e) =>
                setCompany((prev) => ({ ...prev, remark: e.target.value }))
              }
              type="text"
              placeholder="비고"
              autoComplete="off"
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12 }} sx={{ gap: 2 }}>
            <FormLabel htmlFor="address" required>
              기업 주소
            </FormLabel>
            <Grid container spacing={2} alignItems="center">
              {/* 우편번호 */}
              <Grid item xs={12} md={6}>
                <OutlinedInput
                  id="zipcode"
                  name="zipcode"
                  type="text"
                  autoComplete="postal-code"
                  placeholder="우편번호"
                  value={company.zipcode}
                  onChange={(e) =>
                    setCompany((prev) => ({ ...prev, zipcode: e.target.value }))
                  }
                  required
                  size="small"
                />
              </Grid>

              {/* 주소 검색 버튼 */}
              <Button
                variant="outlined"
                onClick={handleClickAddress}
                sx={{ height: "40px" }}
              >
                주소 검색
              </Button>
            </Grid>

            {/* 📌 주소 검색 모달 */}
            <Dialog
              open={openPostcode}
              onClose={() => setOpenPostcode(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>
                주소 검색
                <IconButton
                  onClick={() => setOpenPostcode(false)}
                  sx={{ position: "absolute", right: 8, top: 8 }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <DaumPostcode onComplete={handleComplete} />
              </DialogContent>
            </Dialog>

            {/* 기본 주소 */}
            <OutlinedInput
              id="addressBase"
              name="addressBase"
              type="text"
              autoComplete="street-address"
              placeholder="주소"
              value={company.addressBase}
              onChange={(e) =>
                setCompany((prev) => ({ ...prev, addressBase: e.target.value }))
              }
              readOnly
              required
              size="small"
            />

            {/* 상세 주소 */}
            <OutlinedInput
              id="addressDetail"
              name="addressDetail"
              type="text"
              placeholder="상세주소를 입력하세요"
              value={company.addressDetail}
              onChange={(e) =>
                setCompany((prev) => ({
                  ...prev,
                  addressDetail: e.target.value,
                }))
              }
              required
              size="small"
            />
          </FormGrid>
        </Grid>
      </Box>

      {/* 버튼 영역 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 12,
          mb: 2,
        }}
      >
        {/* 버튼 영역 */}
        <Box sx={{ ml: "auto" }}>
          <Button
            variant="outlined"
            color="primary"
            sx={{ height: 40, fontWeight: 500, px: 2.5 }}
            onClick={handleUpdate}
          >
            수정
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
