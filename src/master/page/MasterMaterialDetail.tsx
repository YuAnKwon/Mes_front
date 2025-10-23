import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { Box, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Select } from "@mui/material";
import { getMaterialDetail, updateMaterialDetail } from "../api/MaterialApi";
import type { MasterMtRegister } from "../type";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface Props {
  itemId: number;
  onClose: (refresh?: boolean) => void; // refresh 옵션 추가
}

export default function MasterMaterialDetail({ itemId, onClose }: Props) {
  const [scaleError, setScaleError] = useState(false);
  const [specError, setSpecError] = useState(false);

  const [material, setMaterial] = useState<MasterMtRegister>({
    materialName: "",
    materialCode: "",
    companyName: "",
    type: "",
    color: "",
    spec: 0,
    scale: "",
    manufacturer: "",
    remark: "",
  });

  //상세정보 불러오기
  useEffect(() => {
    const fetchMaterialDetail = async () => {
      try {
        const response = await getMaterialDetail(itemId); // ← API 호출

        // 상태에 기존 값 채워 넣기
        setMaterial(response);
      } catch (error) {
        console.error("업체 정보 불러오기 실패:", error);
      }
    };

    fetchMaterialDetail();
  }, [itemId]);

  const handleUpdate = async () => {
    try {
      await updateMaterialDetail(itemId, material);
      alert("원자재 수정 완료!");
      onClose(true); // true 전달 → 테이블 갱신
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
    <Box sx={{ p: 2, maxWidth: 800, mx: "auto" }}>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="companyName">매입처명</FormLabel>
            <OutlinedInput
              id="companyName"
              name="companyName"
              value={material.companyName}
              onChange={(e) =>
                setMaterial((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
              type="text"
              placeholder="매입명"
              autoComplete="organization"
              disabled
              size="small"
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
              value={material.materialCode}
              onChange={(e) =>
                setMaterial((prev) => ({
                  ...prev,
                  materialCode: e.target.value,
                }))
              }
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
              value={material.materialName}
              onChange={(e) =>
                setMaterial((prev) => ({
                  ...prev,
                  materialName: e.target.value,
                }))
              }
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
              value={material.type}
              onChange={(e) =>
                setMaterial((prev) => ({ ...prev, type: e.target.value }))
              }
              displayEmpty
              input={<OutlinedInput />}
              size="small"
              required
              fullWidth
            >
              <MenuItem value="" disabled>
                원자재 종류 선택
              </MenuItem>
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
              value={material.color}
              onChange={(e) =>
                setMaterial((prev) => ({ ...prev, color: e.target.value }))
              }
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
              value={material.spec}
              onChange={(e) => {
                const value = e.target.value;

                // 숫자만 허용
                const valid = /^[0-9]*$/;

                setMaterial((prev) => ({
                  ...prev,
                  spec: value, // 문자열 그대로 저장
                }));

                setSpecError(!valid.test(value));
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
              value={material.scale}
              onChange={(e) => {
                const value = e.target.value;

                // 한글 조합 중일 때는 검사하지 않음 (예: 'ㄱ' → '가')
                if (e.nativeEvent.isComposing) return;

                // 한글 또는 영문만 허용
                const valid = /^[\p{L}]+$/u;

                setMaterial((prev) => ({ ...prev, scale: value }));

                if (value === "" || valid.test(value)) {
                  setScaleError(false);
                } else {
                  setScaleError(true);
                }
              }}
              type="text"
              placeholder="규격단위"
              autoComplete="on"
              required
              size="small"
            />
            {scaleError && (
              <span style={{ color: "red", fontSize: "0.75rem" }}>
                문자만 입력해주세요.
              </span>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="manufacturer" required>
              제조사
            </FormLabel>
            <OutlinedInput
              id="manufacturer"
              name="manufacturer"
              value={material.manufacturer}
              onChange={(e) =>
                setMaterial((prev) => ({
                  ...prev,
                  manufacturer: e.target.value,
                }))
              }
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
              value={material.remark}
              onChange={(e) =>
                setMaterial((prev) => ({ ...prev, remark: e.target.value }))
              }
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
          mt: 4,
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
