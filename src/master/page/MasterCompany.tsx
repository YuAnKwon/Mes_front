import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Button from "@mui/material/Button";
import DaumPostcode from 'react-daum-postcode';
import { useState } from 'react';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function MasterCompany() {
    const [address, setAddress] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [openPostcode, setOpenPostcode] = useState(false);

    const handleComplete = (data) => {//data는 주소 검색 전체 결과 객체
        setAddress(data.address); // 선택된 주소 저장
        setOpenPostcode(false);   // 검색창 닫기
    };

    const handleClickAddress = () => {
        setOpenPostcode(true);
    };

  return (
    <Box sx={{ p: 2 }}>
      <h2>업체 등록</h2>
      <Box sx={{ height: 600, width: "100%" }}>
        <Grid container spacing={3} sx={{ mt: 4 }}>
            <FormGrid size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="companyName" required>
                업체명
                </FormLabel>
                <OutlinedInput
                id="companyName"
                name="companyName"
                type="name"
                placeholder="업체명"
                autoComplete="companyName"//뭔내용인지
                required
                size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="businessNum" required>
                사업자 등록번호
                </FormLabel>
                <OutlinedInput
                id="businessNum"
                name="businessNum"
                type="number"
                placeholder="사업자 등록번호"
                autoComplete="businessNum"
                required
                size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="companyType" required>
                업체 유형
                </FormLabel>
                <OutlinedInput
                id="companyType"
                name="companyType"
                type="text"
                placeholder="업체 유형"
                autoComplete="companyType"
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
                type="text"
                placeholder="홍길동"
                autoComplete="ceoName"
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
                type="number"
                placeholder="01012345678"
                autoComplete="ceoPhone"
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
                type="text"
                placeholder="홍길동"
                autoComplete="managerName"
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
                type="email"
                placeholder="example@gmail.com"
                autoComplete="managerEmail"
                required
                size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
                <FormLabel htmlFor="remark" required>
                비고
                </FormLabel>
                <OutlinedInput
                id="remark"
                name="remark"
                type="text"
                placeholder="비고"
                autoComplete="remark"
                required
                size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 12 }} sx={{ gap: 2}}>
                <FormLabel htmlFor="address" required>기업 주소</FormLabel>

                {/* 주소 입력창 */}
                <OutlinedInput
                    id="address"
                    name="address"
                    type="text"
                    placeholder="주소를 클릭해 검색하세요"
                    value={address}
                    onClick={handleClickAddress}
                    readOnly
                    required
                    size="small"
                    sx={{ cursor: 'pointer' }}
                />

                {/* 주소 검색창 (모달처럼 띄우기) */}
                {openPostcode && (
                    <Box sx={{ position: 'relative', zIndex: 10, mt: 2 }}>
                    <DaumPostcode onComplete={handleComplete} />
                    </Box>
                )}

                {/* 상세 주소 입력창 */}
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
          mb: 2,
        }}
      >
    
        {/* 버튼 영역 */}
        <Box sx={{ ml: "auto" }}>
            <Button
            variant="outlined"
            color="primary"
            sx={{ height: 40, fontWeight: 500, px: 2.5 }}
            type='submit'
            >
            업체 등록
            </Button>
        </Box>
      </Box>
    </Box>
  );
}

