import React, { useRef, useState } from "react";
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

export default function WorkOrderSheet() {
  const printRef = useRef<HTMLDivElement>(null);

  const [workOrder] = useState({
    item: {
      lotNumber: "LOT-20241017-001",
      itemName: "알루미늄 프레임",
      itemNumber: "AF-100-250",
      category: "A급 프레임",
      color: "실버 그레이",
      paintingMethod: "정전 분체도장",
      remarks: "표면 품질 A등급 기준",
      photoUrl:
        "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=300&h=300&fit=crop",
    },
    processes: [
      {
        code: "LC-10",
        name: "입고/수입검사",
        time: 10,
        remarks: "찍힘, Burr 등 유해한 흠 없을 것",
      },
      {
        code: "LC-20",
        name: "이물질 제거",
        time: 15,
        remarks: "유분/이물질/먼지 제거",
      },
      {
        code: "LC-30",
        name: "마스킹 1홀(4개소)",
        time: 20,
        remarks: "내부마스킹 (홀 마스킹 필름)",
      },
      {
        code: "LC-40",
        name: "마스킹 2",
        time: 15,
        remarks: "바닥면 마스킹 (마스킹 테이프)",
      },
      {
        code: "LC-50",
        name: "Loading/도장",
        time: 25,
        remarks: "도장망 제품 정렬/상부 도장",
      },
      { code: "LC-60", name: "건조 1", time: 1440, remarks: "자연건조 1day" },
      {
        code: "LC-70",
        name: "Loading/도장",
        time: 25,
        remarks: "제품 반전 / 하부 도장",
      },
      { code: "LC-80", name: "건조 2", time: 1440, remarks: "자연건조 1day" },
      {
        code: "LC-90",
        name: "마스킹 제거",
        time: 15,
        remarks: "마스킹 테이프/필름 제거",
      },
      { code: "LC-100", name: "포장", time: 10, remarks: "비닐 개별포장" },
    ],
  });

  const totalTime = workOrder.processes.reduce((sum, p) => sum + p.time, 0);
  const handlePrint = () => {
    if (!printRef.current) return;

    const printArea = printRef.current;
    const areaHeight = printArea.scrollHeight;
    const areaWidth = printArea.scrollWidth;
    const pageWidth = 794; // A4 width at 96dpi
    const pageHeight = 1123; // A4 height at 96dpi

    // 가로·세로 비율 중 더 작은 쪽으로 축소
    const scale = Math.min(pageWidth / areaWidth, pageHeight / areaHeight);

    const style = document.createElement("style");
    style.innerHTML = `
    @media print {
      @page { size: A4; margin: 8mm; }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      body * { visibility: hidden; }
      #print-area, #print-area * { visibility: visible; }
      #print-area {
        position: absolute; left: 0; top: 0;
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
    py: 1.3,
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
                {workOrder.item.lotNumber}
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
          <Box sx={{ width: "50%", display: "flex", justifyContent: "center" }}>
            <img
              src={workOrder.item.photoUrl}
              alt="제품 이미지"
              style={{ height: "100%", objectFit: "cover" }}
            />
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
                  <TableCell sx={valueCellStyle}>
                    {workOrder.item.lotNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>품목명</TableCell>
                  <TableCell sx={{ ...valueCellStyle, fontWeight: "bold" }}>
                    {workOrder.item.itemName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>품목 번호</TableCell>
                  <TableCell sx={valueCellStyle}>
                    {workOrder.item.itemNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>분류</TableCell>
                  <TableCell sx={valueCellStyle}>
                    {workOrder.item.category}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>색상</TableCell>
                  <TableCell sx={valueCellStyle}>
                    {workOrder.item.color}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>도장 방식</TableCell>
                  <TableCell sx={valueCellStyle}>
                    {workOrder.item.paintingMethod}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellStyle}>비고</TableCell>
                  <TableCell sx={valueCellStyle}>
                    {workOrder.item.remarks}
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
              총 공정 시간:{" "}
              <strong>
                {totalTime}분 ({Math.floor(totalTime / 60)}시간 {totalTime % 60}
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
                  sx={{ ...cellStyle, fontWeight: "bold", width: "12%" }}
                >
                  공정 시간(분)
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
              {workOrder.processes.map((process, index) => (
                <TableRow key={index}>
                  <TableCell sx={cellStyle}>{index + 1}</TableCell>
                  <TableCell sx={cellStyle}>{process.code}</TableCell>
                  <TableCell sx={{ ...cellStyle, fontWeight: "bold" }}>
                    {process.name}
                  </TableCell>
                  <TableCell sx={cellStyle}>{process.time}</TableCell>
                  <TableCell
                    sx={{ ...cellStyle, textAlign: "left", fontSize: "14px" }}
                  >
                    {process.remarks}
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
