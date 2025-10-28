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
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import DaumPostcode from "react-daum-postcode";
import { useState } from "react";
import { CloseIcon } from "flowbite-react";
import { Select } from "@mui/material";
import { registerCompany } from "../api/companyApi";
import type { MasterCpRegister } from "../type";

interface Props {
  onRegisterComplete: () => void;
}

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function MasterCompany({ onRegisterComplete }: Props) {
  const [address, setAddress] = useState("");
  const [openPostcode, setOpenPostcode] = useState(false);

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

  const handleSave = async () => {
    if (
      !companyName ||
      !businessNum ||
      !companyType ||
      !ceoName ||
      !ceoPhone ||
      !managerName ||
      !managerPhone ||
      !managerEmail ||
      !zipcode ||
      !addressBase ||
      !addressDetail
    ) {
      alert("필수값을 모두 입력해주세요.");
      return;
    }

    if (!validateEmail(managerEmail)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    const payload: MasterCpRegister = {
      companyName,
      businessNum: businessNum,
      companyType,
      ceoName,
      ceoPhone: ceoPhone,
      managerName,
      managerPhone: managerPhone,
      managerEmail,
      remark,
      zipcode: zipcode,
      addressBase,
      addressDetail,
    };

    try {
      await registerCompany(payload);
      alert("업체 등록 완료!");
      onRegisterComplete();
    } catch (error) {
      console.error("업체 등록 실패", error);
      alert("등록 실패");
    }
  };

  const handleComplete = (data) => {
    //data는 주소 검색 전체 결과 객체
    setZipcode(data.zonecode);
    setAddress(data.address); // 선택된 주소 저장
    setAddressBase(data.address); // 기본 주소에 저장
    setOpenPostcode(false); // 검색창 닫기
  };

  const handleClickAddress = () => {
    setOpenPostcode(true);
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <Box sx={{ p: 2, maxWidth: 850, mx: "auto" }}>
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
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#aaa" }}>업체 유형 선택</span>;
                }
                const labels: Record<string, string> = {
                  CLIENT: "거래처",
                  SUPPLIER: "매입처",
                };
                return labels[selected] || selected;
              }}
            >
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
              placeholder="123-45-67890"
              autoComplete="off"
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
            <TextField
              id="ceoPhone"
              name="ceoPhone"
              value={company.ceoPhone}
              onChange={(e) =>
                setCompany((prev) => ({ ...prev, ceoPhone: e.target.value }))
              }
              placeholder="010-1234-5678"
              size="small"
              required
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
              onClick={(e) =>
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
            <TextField
              id="managerPhone"
              name="managerPhone"
              value={managerPhone}
              onChange={(e) => setManagerPhone(e.target.value)}
              placeholder="010-1234-5678"
              size="small"
              required
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="managerEmail" required>
              담당자 이메일
            </FormLabel>
            <TextField
              id="managerEmail"
              name="managerEmail"
              value={managerEmail}
              onChange={(e) => setManagerEmail(e.target.value)}
              placeholder="example@gmail.com"
              size="small"
              required
              error={managerEmail !== "" && !validateEmail(managerEmail)}
              helperText={
                managerEmail !== "" && !validateEmail(managerEmail)
                  ? "올바른 이메일 형식이 아닙니다."
                  : ""
              }
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="remark">비고</FormLabel>
            <OutlinedInput
              id="remark"
              name="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
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
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
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
              placeholder="주소"
              autoComplete="street-address"
              value={addressBase}
              onChange={(e) => setAddressBase(e.target.value)}
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
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
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
            onClick={handleSave}
          >
            저장
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
