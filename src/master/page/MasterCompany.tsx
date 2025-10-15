import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { Box, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem } from '@mui/material';
import Button from "@mui/material/Button";
import DaumPostcode from 'react-daum-postcode';
import { useState } from 'react';
import { CloseIcon } from 'flowbite-react';
import { Select } from '@mui/material';


const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function MasterCompany() {
    const [address, setAddress] = useState('');
    const [openPostcode, setOpenPostcode] = useState(false);

    const handleComplete = (data) => {//data는 주소 검색 전체 결과 객체
        setZipcode(data.zonecode);
        setAddress(data.address); // 선택된 주소 저장
        setAddressBase(data.address);    // 기본 주소에 저장
        setOpenPostcode(false);   // 검색창 닫기
    };

    const handleClickAddress = () => {
        setOpenPostcode(true);
    };

    const [companyName, setCompanyName] = useState('');
    const [businessNum, setBusinessNum] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [ceoName, setCeoName] = useState('');
    const [ceoPhone, setCeoPhone] = useState('');
    const [managerName, setManagerName] = useState('');
    const [managerPhone, setManagerPhone] = useState('');
    const [managerEmail, setManagerEmail] = useState('');
    const [remark, setRemark] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [addressBase, setAddressBase] = useState('');
    const [addressDetail, setAddressDetail] = useState('');

    const handleSave = async () => {
        const payload = {
            companyName,
            businessNum,
            companyType,
            ceoName,
            ceoPhone,
            managerName,
            managerPhone,
            managerEmail,
            remark,
            zipcode,
            addressBase: address,
            addressDetail,
        };

        try {
            const response = await fetch('/api/master/company/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            });

            if (response.ok) {
            alert('업체 등록 완료!');
            } else {
            alert('등록 실패');
            }
        } catch (error) {
            console.error(error);
            alert('에러 발생');
        }
    };

    const FormGrid = styled(Grid)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
    }));

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
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    type="name"
                    placeholder="업체명"
                    autoComplete="companyName"//뭔내용인지
                    required
                    size="small"
                />
            </FormGrid>

            <FormGrid  size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="companyType" required>업체 유형</FormLabel>
                <Select
                    id="companyType"
                    name="companyType"
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    displayEmpty
                    input={<OutlinedInput />}
                    size="small"
                    required
                    fullWidth
                >
                    <MenuItem value="" disabled>업체 유형 선택</MenuItem>
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
                    value={businessNum}
                    onChange={(e) => setBusinessNum(e.target.value)}
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
                    value={ceoName}
                    onChange={(e) => setCeoName(e.target.value)}
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
                    value={ceoPhone}
                    onChange={(e) => setCeoPhone(e.target.value)}
                    type="text"
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
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
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
                    value={managerPhone}
                    onChange={(e) => setManagerPhone(e.target.value)}
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
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    type="email"
                    placeholder="example@gmail.com"
                    autoComplete="managerEmail"
                    required
                    size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
                <FormLabel htmlFor="remark">
                비고
                </FormLabel>
                <OutlinedInput
                    id="remark"
                    name="remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    type="text"
                    placeholder="비고"
                    autoComplete="remark"
                    size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 12 }} sx={{ gap: 2 }}>
                <FormLabel htmlFor="address" required>기업 주소</FormLabel>
                <Grid container spacing={2} alignItems="center">
                    {/* 우편번호 */}
                    <Grid item xs={12} md={6}>
                        <OutlinedInput
                            id="zipcode"
                            name="zipcode"
                            type="text"
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
                        sx={{ height: '40px' }}
                    >
                        주소 검색
                    </Button>
                </Grid>

                    {/* 📌 주소 검색 모달 */}
                    <Dialog open={openPostcode} onClose={() => setOpenPostcode(false)} fullWidth maxWidth="sm">
                        <DialogTitle>
                            주소 검색
                            <IconButton 
                            onClick={() => setOpenPostcode(false)} 
                            sx={{ position: 'absolute', right: 8, top: 8 }}
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
            업체 등록
            </Button>
        </Box>
      </Box>
    </Box>
  );
}

