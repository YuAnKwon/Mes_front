import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import type { WorkOrder } from "../type";
import { getWorkOrder } from "../api/OrderInApi";

interface Props {
  id: number;
  lotNum: string;
}

export default function WorkOrder({ id, lotNum }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const [workOrder, setWorkOrder] = useState<WorkOrder>({
    orderItem: {
      id: 0,
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
    },
    routingList: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWorkOrder(id);
        setWorkOrder({
          orderItem: {
            ...response.orderItem,
            imgUrl: response.orderItem.images?.map((img: any) => ({
              id: img.id,
              imgUrl: img.imgUrl,
              repYn: img.repYn,
            })),
          },
          routingList: response.routingList
            .map((r) => ({
              id: r.id,
              routingOrder: r.routingOrder,
              processCode: r.processCode,
              processName: r.processName,
              processTime: r.processTime,
              remark: r.remark,
            }))
            .sort((a, b) => a.routingOrder - b.routingOrder),
        });
      } catch (error) {
        console.error("상세 데이터 불러오기 실패:", error);
      }
    };
    if (id) fetchData();
  }, [id]);

  const mainImage =
    workOrder.orderItem.imgUrl?.find((img) => img.repYn === "Y")?.imgUrl || "";
  const totalTime = workOrder.routingList.reduce(
    (sum, r) => sum + r.processTime,
    0
  );

  const handlePrint = () => {
    if (!printRef.current) return;

    const printArea = printRef.current;
    const areaHeight = printArea.scrollHeight;
    const areaWidth = printArea.scrollWidth;
    const pageWidth = 794; // A4 width at 96dpi
    const pageHeight = 1123; // A4 height at 96dpi

    const scale = Math.min(pageWidth / areaWidth, pageHeight / areaHeight);

    const style = document.createElement("style");
    style.innerHTML = `
@media print {
  @page { size: A4; margin: 8mm; }
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    margin: 0;
    padding: 0;
  }
  body * { visibility: hidden; }
  #print-area, #print-area * { visibility: visible; }
  #print-area {
    position: relative;
    margin: 0 auto;
    transform: scale(${scale});
    transform-origin: top left;
    width: ${areaWidth}px;
  }
  table, tr, td, th { page-break-inside: avoid !important; }
}
`;

    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const cellStyle = {
    border: "1px solid #999",
    textAlign: "center",
    fontSize: "16px",
    py: 1.2,
    px: 1,
  };

  const labelCellStyle = {
    ...cellStyle,
    width: "25%",
    fontWeight: "bold",
    bgcolor: "#f5f5f5",
  };

  const valueCellStyle = {
    ...cellStyle,
    textAlign: "left",
    pl: 2,
  };

  // enum → 한글 변환 함수
  const formatType = (type: string) => {
    switch (type) {
      case "GENERAL":
        return "일반";
      case "CAR":
        return "자동차";
      case "SHIPBUILDING":
        return "조선";
      case "DEFENSE":
        return "방산";
      default:
        return "기타";
    }
  };

  const formatCoating = (coating: string) => {
    switch (coating) {
      case "POWDER":
        return "분체";
      case "LIQUID":
        return "액체";
      default:
        return "기타";
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        id="print-area"
        ref={printRef}
        sx={{
          width: "850px",
          p: 2,
          border: "1px solid #000",
          bgcolor: "#fff",
          fontSize: "16px",
        }}
      >
        {/* 상단: 제목 + LOT */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold">
              작업지시서
            </Typography>
            <Box
              sx={{
                border: "1px solid #000",
                p: 1,
                mt: 2,
                display: "inline-block",
              }}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                {lotNum}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 수주 대상 품목 정보 */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              bgcolor: "#1f2937",
              color: "#fff",
              py: 0.8,
              px: 2,
              fontWeight: "bold",
              fontSize: "17px",
              height: "45px",
              display: "flex",
              alignItems: "center",
            }}
          >
            수주대상품목 상세 정보
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {/* 대표 사진 */}
          <Box
            sx={{
              width: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {mainImage ? (
              <img
                src={mainImage}
                alt="제품 이미지"
                style={{ height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography
                sx={{
                  color: "#999",
                }}
              >
                등록된 이미지가 없습니다
              </Typography>
            )}
          </Box>

          {/* 품목 정보 테이블 */}
          <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              boxShadow: "none",
              border: "1px solid #000",
            }}
          >
            <Table size="small" sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={labelCellStyle}>LOT 번호</TableCell>
                  <TableCell sx={valueCellStyle}>{lotNum}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>품목명</TableCell>
                  <TableCell sx={{ ...valueCellStyle, fontWeight: "bold" }}>
                    {workOrder.orderItem.itemName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>품목 번호</TableCell>
                  <TableCell sx={valueCellStyle}>
                    {workOrder.orderItem.itemCode}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>분류</TableCell>
                  <TableCell sx={valueCellStyle}>
                    {formatType(workOrder.orderItem.type)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>색상</TableCell>
                  <TableCell sx={valueCellStyle}>
                    {workOrder.orderItem.color}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>도장 방식</TableCell>
                  <TableCell sx={valueCellStyle}>
                    {formatCoating(workOrder.orderItem.coatingMethod)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>비고</TableCell>
                  <TableCell sx={valueCellStyle}>
                    {workOrder.orderItem.remark}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 공정 순서 */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              bgcolor: "#1f2937",
              color: "#fff",
              py: 0.8,
              px: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "45px",
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "17px" }}>
              공정 순서
            </Typography>
            <Typography sx={{ fontSize: "15px" }}>
              총 공정 시간 :{" "}
              <strong>
                {Math.floor(totalTime / 60)}시간 {totalTime % 60}분 ({totalTime}
                분)
              </strong>
            </Typography>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", border: "1px solid #000" }}
        >
          <Table size="small" sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell
                  sx={{ ...cellStyle, fontWeight: "bold", width: "8%" }}
                >
                  순서
                </TableCell>
                <TableCell
                  sx={{ ...cellStyle, fontWeight: "bold", width: "12%" }}
                >
                  공정 코드
                </TableCell>
                <TableCell
                  sx={{ ...cellStyle, fontWeight: "bold", width: "20%" }}
                >
                  공정명
                </TableCell>
                <TableCell
                  sx={{ ...cellStyle, fontWeight: "bold", width: "15%" }}
                >
                  공정 시간 (분)
                </TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: "bold" }}>
                  비고
                </TableCell>
                <TableCell
                  sx={{ ...cellStyle, fontWeight: "bold", width: "10%" }}
                >
                  확인
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workOrder.routingList.map((process, index) => (
                <TableRow key={process.id}>
                  <TableCell sx={cellStyle}>{index + 1}</TableCell>
                  <TableCell sx={cellStyle}>{process.processCode}</TableCell>
                  <TableCell sx={{ ...cellStyle, fontWeight: "bold" }}>
                    {process.processName}
                  </TableCell>
                  <TableCell sx={cellStyle}>{process.processTime}</TableCell>
                  <TableCell
                    sx={{ ...cellStyle, textAlign: "left", fontSize: 14 }}
                  >
                    {process.remark}
                  </TableCell>
                  <TableCell sx={cellStyle}></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          size="large"
          sx={{ px: 4, py: 1, fontSize: "1rem" }}
          onClick={handlePrint}
        >
          출력
        </Button>
      </Box>
    </Box>
  );
}
