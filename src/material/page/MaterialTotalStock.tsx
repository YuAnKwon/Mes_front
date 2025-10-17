import { DataGrid, useGridApiRef, type GridColDef } from "@mui/x-data-grid";
import Pagination from "../../common/Pagination";
import { Box, Button } from "@mui/material";
import SearchBar from "../../common/SearchBar";
import type { MaterialTotalStock } from "../type";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx-js-style";
import { getMaterialTotalStock } from "../api/MaterialTotalStockApi";
import { createStyledWorksheet } from "../../common/ExcelUtils";

export function MaterialTotalStock() {
  const [materialTotalStock, setMaterialTotalStock] = useState<
    MaterialTotalStock[]
  >([]);
  const apiRef = useGridApiRef();
  const sampleData = [
    "회사1",
    "회사2",
    "품목A",
    "품목B",
    "입고번호001",
    "입고번호002",
  ];
  const searchOptions = [
    { label: "매입처명", value: "companyName" },
    { label: "품목번호", value: "materialCode" },
    { label: "품목명", value: "materialName" },
  ];
  const columns: GridColDef[] = [
    {
      field: "materialId",
      headerName: "No",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
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
      headerName: "매입처명",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stock",
      headerName: "재고량(개)",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
  ];

  const fetchMaterialOutData = async () => {
    try {
      const response = await getMaterialTotalStock();
      setMaterialTotalStock(response);
    } catch (error) {
      console.error("데이터 로딩 실패", error);
      alert("재고현황 데이터를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchMaterialOutData();
  }, []);

  const handleExcelDownload = () => {
    if (!materialTotalStock || materialTotalStock.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return; // 더 이상 진행하지 않음
    }
    const excelData = materialTotalStock.map((item) => ({
      No: item.materialId,
      품목명: item.materialName,
      품목번호: item.materialCode,
      매입처명: item.companyName,
      "재고량(개)": item.stock,

      // "거래처명": item.companyName ?? "", // null 방지
    }));

    const worksheet = createStyledWorksheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "원자재_재고현황.xlsx");
  };

  const handleSearch = (criteria: string, query: string) => {
    console.log("검색 실행:", { criteria, query });
  };
  return (
    <Box sx={{ p: 2 }}>
      <h2>원자재 재고현황</h2>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        {/* 공통 검색바 */}
        <Box sx={{ flex: 1 }}>
          <SearchBar
            searchOptions={searchOptions}
            autoCompleteData={sampleData}
            onSearch={handleSearch}
          />
        </Box>

        {/* 버튼 영역 */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="outlined"
            color="success"
            sx={{ height: 40, fontWeight: 500, px: 2.5 }}
            onClick={handleExcelDownload}
          >
            엑셀 다운로드
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 1200, width: "100%" }}>
        <DataGrid
          rows={materialTotalStock}
          columns={columns}
          getRowId={(row) => row.materialId}
          disableRowSelectionOnClick
          apiRef={apiRef}
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
            "& .MuiDataGrid-cell--editable": {
              position: "relative",
            },
            "& .MuiDataGrid-cell--editable::after": {
              content: '"✎"',
              position: "absolute",
              right: 6,
              top: 6,
              fontSize: "12px",
              color: "#999",
            },
            "& .MuiDataGrid-cell--editing::after": {
              content: '""',
            },
          }}
        />
      </Box>
    </Box>
  );
}
