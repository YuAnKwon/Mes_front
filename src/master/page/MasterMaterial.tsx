import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { Box, MenuItem } from '@mui/material';
import Button from "@mui/material/Button";
import { useState } from 'react';
import { Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function MasterMaterial() {

    const [companyName, setCompanyName] = useState('');
    const [businessNum, setBusinessNum] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [ceoName, setCeoName] = useState('');
    const [ceoPhone, setCeoPhone] = useState('');
    const [managerName, setManagerName] = useState('');
    const [managerPhone, setManagerPhone] = useState('');
    const [managerEmail, setManagerEmail] = useState('');
    const [remark, setRemark] = useState('');

    const navigate = useNavigate();

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
        };

        try {
            const response = await fetch('/api/master/company/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            });

            if (response.ok) {
            alert('업체 등록 완료!');
            navigate('/master/company/list');
            } else {
            alert('등록 실패');
            }
        } catch (error) {
            console.error(error);
            alert('에러 발생');
        }
    };


  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: "auto"  }}>
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
                        type="text"
                        placeholder="업체명"
                        autoComplete="organization"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6 }} />
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
                        value={ceoName}
                        onChange={(e) => setCeoName(e.target.value)}
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
                        value={ceoPhone}
                        onChange={(e) => setCeoPhone(e.target.value)}
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
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
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
                        value={managerPhone}
                        onChange={(e) => setManagerPhone(e.target.value)}
                        type="text"
                        placeholder="01012345678"
                        autoComplete="tel"
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
                        autoComplete="email"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6  }}>
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
                        autoComplete="off"
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
                원자재 등록
                </Button>
            </Box>
        </Box>
        
    </Box>
  );
}

