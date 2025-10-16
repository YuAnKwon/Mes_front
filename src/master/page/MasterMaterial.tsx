console.log("컴포넌트 진입")


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

    const [itemCode, setCompanyName] = useState('');
    const [itemName, setItemName] = useState('');
    const [company, setCompany] = useState('');
    const [type, setType] = useState('');
    const [color, setColor] = useState('');
    const [spec, setSpec] = useState('');
    const [scale, setScale] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [remark, setRemark] = useState('');

    const navigate = useNavigate();

    const handleSave = async () => {
        const payload = {
            itemCode,
            itemName,
            company,
            type,
            color,
            spec,
            scale,
            manufacturer,
            remark,
        };

        try {
            const response = await fetch('/api/master/masterial/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            });

            if (response.ok) {
            alert('원자재 등록 완료!');
            navigate('/master/material/list');
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
        <h2>원자재 등록</h2>
        
        <Box sx={{ height: 600, width: "100%" }}>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="company" required>
                    매입처명
                    </FormLabel>
                    <OutlinedInput
                        id="company"
                        name="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        type="text"
                        placeholder="매입명"
                        autoComplete="organization"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6 }} />
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="itemCode" required>
                    품목번호
                    </FormLabel>
                    <OutlinedInput
                        id="itemCode"
                        name="itemCode"
                        value={itemCode}
                        onChange={(e) => setCompanyName(e.target.value)}
                        type="text"
                        placeholder="품목번호"
                        autoComplete="on"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="itemName" required>
                    품목명
                    </FormLabel>
                    <OutlinedInput
                        id="itemName"
                        name="itemName"
                        value={company}
                        onChange={(e) => setItemName(e.target.value)}
                        type="text"
                        placeholder="품목명"
                        autoComplete="on"
                        required
                        size="small"
                    />
                </FormGrid>
                
                <FormGrid  size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="type" required>
                    분류
                    </FormLabel>
                    <Select
                        id="type"
                        name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        displayEmpty
                        input={<OutlinedInput />}
                        size="small"
                        required
                        fullWidth
                    >
                        <MenuItem value="" disabled>원자재 종류 선택</MenuItem>
                        <MenuItem value="PAINT">페인트</MenuItem>
                        <MenuItem value="THINNER">신나</MenuItem>
                        <MenuItem value="CLEANER">세척제</MenuItem>
                        <MenuItem value="HARDENER">경화제</MenuItem>
                    </Select>
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="color" required>
                    색상
                    </FormLabel>
                    <OutlinedInput
                        id="color"
                        name="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        type="text"
                        placeholder="색상"
                        autoComplete="on"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 3 }}>
                    <FormLabel htmlFor="spec" required>
                    규격
                    </FormLabel>
                    <OutlinedInput
                        id="spec"
                        name="spec"
                        value={spec}
                        onChange={(e) => setSpec(e.target.value)}
                        type="text"
                        placeholder="규격"
                        autoComplete="on"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 3 }}>
                    <FormLabel htmlFor="scale" required>
                    규격단위
                    </FormLabel>
                    <OutlinedInput
                        id="scale"
                        name="scale"
                        value={scale}
                        onChange={(e) => setScale(e.target.value)}
                        type="text"
                        placeholder="규격단위"
                        autoComplete="on"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="manufacturer" required>
                    제조사
                    </FormLabel>
                    <OutlinedInput
                        id="manufacturer"
                        name="manufacturer"
                        value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                        type="text"
                        placeholder="제조사"
                        autoComplete="organization"
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

