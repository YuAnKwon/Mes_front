import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Select } from "@mui/material";
import { registerMaterial } from "../api/MaterialApi";
import type { MasterMtRegister } from "../type";
import { getSupplierList } from "../api/companyApi";

interface Props {
  onRegisterComplete: () => void;
}

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function MasterMaterial({ onRegisterComplete }: Props) {
  const [materialCode, setMaterialCode] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [spec, setSpec] = useState("");
  const [specError, setSpecError] = useState(false); // 에러 상태
  const [scale, setScale] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [remark, setRemark] = useState("");
  const [companyList, setCompanyList] = useState<string[]>([]); // 자동완성용 리스트

  useEffect(() => {
    // 매입처 리스트 가져오기
    const fetchCompanies = async () => {
      try {
        const response = await getSupplierList();
        const names = response.map((item: any) => item.companyName);
        setCompanyList(names);
      } catch (error) {
        console.error("매입처 목록 불러오기 실패:", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleSave = async () => {
    // 필수값 체크
    if (
      !companyName ||
      !materialCode ||
      !materialName ||
      !type ||
      !color ||
      !spec ||
      !scale ||
      !manufacturer
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    // 규격이 숫자인지 확인
    if (!/^\d+$/.test(spec)) {
      alert("규격에는 숫자만 입력해주세요.");
      return;
    }

    const payload: MasterMtRegister = {
      materialCode,
      materialName,
      companyName,
      type,
      color,
      spec: Number(spec),
      scale,
      manufacturer,
      remark,
    };

    try {
      await registerMaterial(payload);
      alert("원자재 등록 완료!");
      onRegisterComplete();
    } catch (error) {
      if (error.response?.data?.message?.includes("이미 존재하는 품목번호")) {
        alert("이미 존재하는 품목번호입니다.");
      } else {
        console.error("등록 실패", error);
        alert("등록 실패");
      }
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 900, mx: "auto" }}>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="companyName" required>
              매입처명
            </FormLabel>

            <Autocomplete
              freeSolo
              options={companyList}
              value={companyName}
              onChange={(e, newValue) => setCompanyName(newValue || "")}
              onInputChange={(e, newInputValue) =>
                setCompanyName(newInputValue)
              }
              renderInput={(params) => {
                // 리스트에 없는 값이면 에러 표시
                const isError =
                  companyName.trim() !== "" &&
                  !companyList.includes(companyName);
                return (
                  <TextField
                    {...params}
                    placeholder="매입처명"
                    size="small"
                    required
                    error={isError}
                    helperText={
                      isError ? "등록된 매입처만 선택 가능합니다." : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: isError ? "red" : "black",
                        },
                        "&:hover fieldset": {
                          borderColor: isError ? "red" : "black",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: isError ? "red" : "black",
                        },
                      },
                    }}
                  />
                );
              }}
              ListboxProps={{
                style: { maxHeight: 200, overflowY: "auto" },
              }}
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }} />
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="materialCode" required>
              품목번호
            </FormLabel>
            <OutlinedInput
              id="materialCode"
              name="materialCode"
              value={materialCode}
              onChange={(e) => setMaterialCode(e.target.value)}
              type="text"
              placeholder="품목번호"
              autoComplete="on"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="materialName" required>
              품목명
            </FormLabel>
            <OutlinedInput
              id="materialName"
              name="materialName"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
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
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <span style={{ color: "#aaa" }}>원자재 종류 선택</span>
                  );
                }
                const labels: Record<string, string> = {
                  PAINT: "페인트",
                  THINNER: "신나",
                  CLEANER: "세척제",
                  HARDENER: "경화제",
                };
                return labels[selected] || selected;
              }}
            >
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
              onChange={(e) => {
                const value = e.target.value;
                // 숫자만 허용 (빈 값도 가능)
                if (/^\d*$/.test(value)) {
                  setSpec(value);
                  setSpecError(false);
                } else {
                  setSpecError(true);
                }
              }}
              type="text"
              placeholder="규격"
              autoComplete="on"
              required
              size="small"
            />
            {specError && (
              <span style={{ color: "red", fontSize: "0.75rem" }}>
                숫자만 입력해주세요.
              </span>
            )}
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
          mt: 8,
          mb: 2,
        }}
      >
        {/* 버튼 영역 */}
        <Box sx={{ ml: "auto" }}>
          <Button
            variant="outlined"
            color="primary"
            sx={{ height: 40, fontWeight: 500 }}
            onClick={handleSave}
          >
            저장
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
