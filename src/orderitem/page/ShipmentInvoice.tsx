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
import { useEffect, useRef, useState } from "react";
import { formatDate, type ShipInvoice } from "../type";
import { getShip } from "../api/OrderInApi";
import { useParams } from "react-router-dom";

export default function ShipmentInvoice() {
  const { id } = useParams<{ id: string }>();
  const [shipData, setShipData] = useState<ShipInvoice[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const data = await getShip(Number(id));
        setShipData(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("출하증 데이터 불러오기 실패:", error);
      }
    };
    fetchData();
  }, [id]);

  const handlePrint = () => {
    if (!printRef.current) return;

    // 사이드바, 다른 요소 숨기기
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #print-area, #print-area * {
          visibility: visible;
        }
        @page {
          size: landscape;
          margin: 10mm;
        }
        #print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);

    window.print();

    document.head.removeChild(style);
  };

  if (shipData.length === 0) {
    return <Typography sx={{ p: 2 }}>출하증 정보를 불러오는 중...</Typography>;
  }

  const first = shipData[0];

  const cellStyle = {
    border: "1px solid #000",
    textAlign: "center",
    fontSize: "18px",
    py: 1.3,
    px: 1,
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
          width: "1000px",
          p: 2,
          border: "1px solid #000",
          bgcolor: "#fff",
          fontSize: "18px",
        }}
      >
        {/* 상단: 출하증 + 거래처명 + 결재란 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
            mb: 2,
          }}
        >
          {/* 왼쪽 - 출하증 + 거래처명 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              pr: 2,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              출하증
            </Typography>
            <Box
              sx={{
                border: "1px solid #000",
                p: 1,
                textAlign: "center",
                minWidth: 180,
                mt: 2,
              }}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: "inherit" }}>
                {first.companyName}
              </Typography>
            </Box>
          </Box>

          {/* 오른쪽 - 결재란 */}
          <TableContainer
            component={Paper}
            sx={{
              width: 320,
              boxShadow: "none",
              border: "1px solid #000",
              ml: 2,
            }}
          >
            <Table size="small" sx={{ borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow sx={{ height: 35 }}>
                  {["담당", "검토", "승인"].map((label) => (
                    <TableCell
                      key={label}
                      sx={{ ...cellStyle, fontWeight: "bold", width: "33%" }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ height: 70 }}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <TableCell key={i} sx={cellStyle}></TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 공급자 정보 */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#1f2937",
              pb: 1,
              display: "inline-block",
            }}
          >
            공급자 정보
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              mb: 2,
              boxShadow: "none",
              border: "1px solid #000",
            }}
          >
            <Table size="small" sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow>
                  <TableCell
                    rowSpan={4}
                    sx={{ ...cellStyle, width: "6%", fontWeight: "bold" }}
                  >
                    공<br />급<br />자
                  </TableCell>
                  <TableCell sx={{ ...cellStyle, width: "15%" }}>
                    출고번호
                  </TableCell>
                  <TableCell sx={{ ...valueCellStyle, width: "29%" }}>
                    {first.outNum}
                  </TableCell>
                  <TableCell sx={{ ...cellStyle, width: "12%" }}>TEL</TableCell>
                  <TableCell sx={valueCellStyle}>055-313-0716</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={cellStyle}>
                    사업자
                    <br />
                    등록번호
                  </TableCell>
                  <TableCell sx={valueCellStyle}>622-81-21575</TableCell>
                  <TableCell sx={cellStyle}>상호</TableCell>
                  <TableCell sx={valueCellStyle}>대원공업(주)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={cellStyle}>주소</TableCell>
                  <TableCell colSpan={3} sx={valueCellStyle}>
                    경상남도 김해시 진례면 서부로 406
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 출하/납품 정보 */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#1f2937",
              pb: 1,
              display: "inline-block",
            }}
          >
            출하 정보
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              mb: 2,
              boxShadow: "none",
              border: "1px solid #000",
            }}
          >
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ ...cellStyle, width: "21%" }}>
                    입고일자
                  </TableCell>
                  <TableCell sx={{ ...valueCellStyle, width: "29%" }}>
                    {formatDate(first.inDate)}
                  </TableCell>
                  <TableCell sx={{ ...cellStyle, width: "20%" }}>
                    출고일자
                  </TableCell>
                  <TableCell sx={valueCellStyle}>
                    {formatDate(first.outDate)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={cellStyle}>납품지주소</TableCell>
                  <TableCell colSpan={3} sx={valueCellStyle}>
                    {first.companyAddr}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 품목 테이블 */}
        <Box>
          <Typography
            sx={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#1f2937",
              pb: 1,
              display: "inline-block",
            }}
          >
            출하 품목
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ mb: 2, boxShadow: "none", border: "1px solid #000" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["품목번호", "품목명", "수량"].map((label) => (
                    <TableCell
                      key={label}
                      sx={{ ...cellStyle, fontWeight: "bold", width: "33%" }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {shipData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={cellStyle}>{item.itemCode}</TableCell>
                    <TableCell sx={cellStyle}>{item.itemName}</TableCell>
                    <TableCell sx={cellStyle}>{item.outAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* 출력 버튼 */}
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
