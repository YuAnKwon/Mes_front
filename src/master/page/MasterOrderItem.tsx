import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { Box, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { MasterOrItRegister } from "../type";
import { registerOrderItem } from "../api/OrderItemApi";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function MasterOrderItem() {
  const [company, setCompany] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [type, setType] = useState("");
  const [coatingMethod, setCoatingMethod] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [color, setColor] = useState("");
  const [remark, setRemark] = useState("");

  const navigate = useNavigate();

  const handleSave = async () => {
    const payload: MasterOrItRegister = {
      itemCode: Number(itemCode),
      itemName,
      company,
      type,
      unitPrice: Number(unitPrice),
      color,
      coatingMethod,
      imgUrl: [],
      routing: [],
      remark,
    };

    try {
      await registerOrderItem(payload);
      alert("수주대상품목 등록 완료!");
      navigate("/master/orderitem/list");
    } catch (error) {
      console.error("수주대상품목 등록 실패", error);
      alert("등록 실패");
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: "auto" }}>
      <h2>수주대상등록 등록</h2>

      <Box sx={{ height: 600, width: "100%" }}>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="company" required>
              거래처명
            </FormLabel>
            <OutlinedInput
              id="company"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              type="text"
              placeholder="거래처명"
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
              onChange={(e) => setItemCode(e.target.value)}
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
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              type="text"
              placeholder="품목명"
              autoComplete="on"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
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
              <MenuItem value="" disabled>
                원자재 종류 선택
              </MenuItem>
              <MenuItem value="GENERAL">일반</MenuItem>
              <MenuItem value="CAR">자동차</MenuItem>
              <MenuItem value="SHIPBUILDING">조선</MenuItem>
              <MenuItem value="DEFENSE">방산</MenuItem>
            </Select>
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="coatingMethod" required>
              도장 방식
            </FormLabel>
            <Select
              id="coatingMethod"
              name="coatingMethod"
              value={coatingMethod}
              onChange={(e) => setCoatingMethod(e.target.value)}
              displayEmpty
              input={<OutlinedInput />}
              size="small"
              required
              fullWidth
            >
              <MenuItem value="" disabled>
                도장 방식 선택
              </MenuItem>
              <MenuItem value="POWDER">분체</MenuItem>
              <MenuItem value="LIQUID">액체</MenuItem>
            </Select>
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="unitPrice" required>
              품목단가
            </FormLabel>
            <OutlinedInput
              id="unitPrice"
              name="unitPrice"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              type="text"
              placeholder="품목단가"
              autoComplete="on"
              required
              size="small"
            />
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
          <FormGrid size={{ xs: 12 }}>
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
            수주대상품목 등록
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
