import { useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import Pagination from "./Pagination";

// -------------------- 입고 테이블 --------------------
export default function InboundTable() {
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

  return (
    <Box sx={{ p: 2 }}>
      <h2>수주대상 품목 입고 등록</h2>
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
