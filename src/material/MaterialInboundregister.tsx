import { Box, Button, Typography } from "@mui/material";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Pagination from "../common/Pagination";
import { useState } from "react";
import * as XLSX from "xlsx-js-style";

export function MaterialInboundregister() {
  const [rows, setRows] = useState(
    Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      materialName: `품목${i + 1}`,
      materialCode: `${100 + i}`,
      companyName: `회사${(i % 10) + 1}`,
      type: ["방산", "자동차", "조선"][i % 3],
      inAmount: "",
      inDate: "",
      remark: `비고 ${i + 1}123123`,
    }))
  );

  const columns: GridColDef[] = [
    {
      field: "materialName",
      headerName: "품목명",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "materialCode",
      headerName: "품목번호",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "companyName",
      headerName: "거래처명",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "type",
      headerName: "분류",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "inAmount",
      headerName: "수량",
      width: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "number",
    },
    {
      field: "inDate",
      headerName: "입고일자",
      width: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "date",
    },

    {
      field: "remark",
      headerName: "비고",
      width: 250,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => (
        <Typography
          sx={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxHeight: 60,
            overflowY: "auto",
            p: 1,
          }}
        >
          {params.value}
        </Typography>
      ),
    },
  ];

  const handleExcelDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "원자재_입고_등록_목록.xlsx");
  };

  const handleRegister = () => {
    // 등록 버튼 클릭 시 동작 정의
    console.log("등록 버튼 클릭됨");
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2>원자재 입고 등록</h2>

      {/* 버튼 영역 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          color="success"
          onClick={handleExcelDownload}
        >
          엑셀 다운로드
        </Button>
        <Button variant="outlined" color="primary" onClick={handleRegister}>
          등록
        </Button>
      </Box>

      <Box sx={{ height: 1200, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          checkboxSelection
          pagination
          pageSizeOptions={[10, 20, 30]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 20 } },
          }}
          slotProps={{
            basePagination: {
              material: {
                ActionsComponent: Pagination, // 커스텀 페이징 적용
              },
            },
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </Box>
  );
}
