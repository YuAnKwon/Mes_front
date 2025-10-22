import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { Box, Checkbox, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Select } from "@mui/material";
import type {
  imgType,
  MasterOrItRegister,
  MasterRouting,
} from "../../master/type";
import { getOrItDetail } from "../../master/api/OrderItemApi";
import { getRoutingList } from "../../master/api/RoutingApi";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface Props {
  itemId: number;
}

export default function MasterOrderItemReadOnly({ itemId }: Props) {
  const [imgFiles, setImgFiles] = useState<imgType[]>([]);
  const [selectedRoutings, setSelectedRoutings] = useState<MasterRouting[]>([]);
  const [allRoutings, setAllRoutings] = useState<MasterRouting[]>([]);

  const [orderItem, setOrderItem] = useState<MasterOrItRegister>({
    itemCode: "",
    itemName: "",
    company: "",
    type: "",
    unitPrice: 0,
    color: "",
    coatingMethod: "",
    remark: "",
    imgUrl: [],
    routing: [],
  });

  // 1️⃣ 전체 공정 리스트 가져오기
  useEffect(() => {
    const fetchRoutings = async () => {
      try {
        const list = await getRoutingList();
        setAllRoutings(list);
      } catch (error) {
        console.error("공정 리스트 불러오기 실패", error);
      }
    };
    fetchRoutings();
  }, []);

  // 2️⃣ 품목 상세 데이터 가져오기
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getOrItDetail(itemId);
        setOrderItem(response);

        // 이미지 정렬
        if (response.images) {
          const sortedImages = response.images.sort((a, b) =>
            a.repYn === "Y" ? -1 : b.repYn === "Y" ? 1 : 0
          );

          const existingImgs: imgType[] = sortedImages.map((img) => ({
            id: img.id,
            imgUrl: img.imgUrl,
            repYn: img.repYn,
            file: undefined,
          }));

          setImgFiles(existingImgs);
        }

        // 공정 매핑 (전체 공정 리스트와 매칭)
        if (
          response.routing &&
          response.routing.length > 0 &&
          allRoutings.length > 0
        ) {
          const mappedRoutings = response.routing.map((r: any) => {
            const full = allRoutings.find((a) => a.id === r.routingId);
            return {
              routingOrder: r.routingOrder,
              id: r.routingId,
              processCode: full?.processCode ?? "",
              processName: full?.processName ?? "",
              processTime: full?.processTime ?? 0,
              remark: full?.remark ?? "",
            };
          });
          setSelectedRoutings(mappedRoutings);
        }
      } catch (error) {
        console.error("품목 불러오기 실패:", error);
      }
    };
    loadData();
  }, [itemId, allRoutings]); // allRoutings가 먼저 채워져야 매핑 가능

  // ✅ DataGrid 컬럼 정의
  const columns: GridColDef[] = [
    {
      field: "routingOrder",
      headerName: "순서",
      headerAlign: "center",
      align: "center",
      width: 80,
    },
    {
      field: "processCode",
      headerName: "공정코드",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "processName",
      headerName: "공정명",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "processTime",
      headerName: "공정시간(분)",
      headerAlign: "center",
      align: "center",
      width: 130,
    },
    {
      field: "remark",
      headerName: "비고",
      headerAlign: "center",
      flex: 1,
    },
  ];

  const inputStyle = {
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
    "&.Mui-focused": { boxShadow: "none" },
    "& input": { cursor: "default" },
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="company">거래처명</FormLabel>
            <OutlinedInput
              id="company"
              value={orderItem.company}
              readOnly
              size="small"
              sx={inputStyle}
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}></FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="itemCode">품목번호</FormLabel>
            <OutlinedInput
              id="itemCode"
              value={orderItem.itemCode}
              readOnly
              size="small"
              sx={inputStyle}
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="itemName">품목명</FormLabel>
            <OutlinedInput
              id="itemName"
              value={orderItem.itemName}
              readOnly
              size="small"
              sx={inputStyle}
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="type">분류</FormLabel>
            <OutlinedInput
              id="type"
              value={
                orderItem.type === "GENERAL"
                  ? "일반"
                  : orderItem.type === "CAR"
                  ? "자동차"
                  : orderItem.type === "SHIPBUILDING"
                  ? "조선"
                  : orderItem.type === "DEFENSE"
                  ? "방산"
                  : ""
              }
              readOnly
              size="small"
              sx={inputStyle}
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="coatingMethod">도장 방식</FormLabel>
            <OutlinedInput
              id="coatingMethod"
              value={
                orderItem.coatingMethod === "POWDER"
                  ? "분체"
                  : orderItem.coatingMethod === "LIQUID"
                  ? "액체"
                  : ""
              }
              readOnly
              size="small"
              sx={inputStyle}
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="unitPrice">품목단가</FormLabel>
            <OutlinedInput
              id="unitPrice"
              value={orderItem.unitPrice}
              readOnly
              size="small"
              sx={inputStyle}
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="color">색상</FormLabel>
            <OutlinedInput
              id="color"
              value={orderItem.color}
              readOnly
              size="small"
              sx={inputStyle}
            />
          </FormGrid>

          <FormGrid size={{ xs: 12 }}>
            <FormLabel htmlFor="remark">비고</FormLabel>
            <OutlinedInput
              id="remark"
              value={orderItem.remark}
              readOnly
              size="small"
              sx={inputStyle}
            />
          </FormGrid>
        </Grid>

        {/* 이미지 */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 4 }}>
          {imgFiles.map((img, index) => (
            <Box
              key={index}
              sx={{ width: 150, height: 150, position: "relative" }}
            >
              <img
                src={img.imgUrl}
                alt={`이미지 ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {img.repYn === "Y" && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bgcolor: "yellow",
                    px: 0.5,
                    fontSize: 12,
                  }}
                >
                  대표 이미지
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* 선택된 공정 */}
        <Box sx={{ mt: 4 }}>
          <Typography fontWeight="bold">공정 순서</Typography>
          <DataGrid
            rows={selectedRoutings}
            columns={columns}
            hideFooter
            density="compact"
            getRowId={(row) => row.id}
          />
          <Box sx={{ mt: 2 }}>
            총 공정 시간:{" "}
            {Math.floor(
              selectedRoutings.reduce(
                (sum, r) => sum + Number(r.processTime),
                0
              ) / 60
            )}{" "}
            시간{" "}
            {selectedRoutings.reduce(
              (sum, r) => sum + Number(r.processTime),
              0
            ) % 60}{" "}
            분
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
