import { DataGrid, useGridApiRef, type GridColDef } from "@mui/x-data-grid";
import Pagination from "../../common/Pagination";
import { Box, Button, Typography } from "@mui/material";
import type { MaterialTotalStock } from "../type";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx-js-style";
import { getMaterialTotalStock } from "../api/MaterialTotalStockApi";
import { createStyledWorksheet } from "../../common/ExcelUtils";
import NewSearchBar from "../../common/NewSearchBar";

export function MaterialTotalStock() {
  const [materialTotalStock, setMaterialTotalStock] = useState<
    MaterialTotalStock[]
  >([]);
  const apiRef = useGridApiRef();
  const [filteredMaterials, setFilteredMaterials] = useState<
    MaterialTotalStock[]
  >([]);
  const [autoCompleteMap, setAutoCompleteMap] = useState<
    Record<string, string[]>
  >({
    companyName: [], //수정
    materialCode: [], //수정
    materialName: [], //수정
  });

  const handleSearch = (criteria: string, query: string) => {
    if (!query.trim()) {
      setFilteredMaterials(materialTotalStock); // 검색어 없으면 전체 리스트 수정
      return;
    }

    const filtered = materialTotalStock.filter((item) =>
      item[criteria as keyof MaterialTotalStock] //수정
        ?.toString()
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    setFilteredMaterials(filtered);
  };

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
      width: 180,
      headerAlign: "center",
      align: "center",
      sortComparator: (a, b) => {
        const numA = parseInt(a.replace(/[^0-9]/g, "")) || 0;
        const numB = parseInt(b.replace(/[^0-9]/g, "")) || 0;
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
      },
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
      headerName: "재고량",
      width: 150,
      headerAlign: "center",
      align: "center",
      type: "number",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMaterialTotalStock(); //수정
        setMaterialTotalStock(data); //수정

        // ✅ 각 필드별 중복 없는 자동완성 리스트 만들기
        const companyNames = Array.from(
          new Set(data.map((m) => m.companyName))
        ); //수정
        const materialCodes = Array.from(
          new Set(data.map((m) => m.materialCode))
        ); //수정
        const materialNames = Array.from(
          new Set(data.map((m) => m.materialName))
        ); //수정

        setFilteredMaterials(data); //초기값

        setAutoCompleteMap({
          companyName: companyNames, //수정
          materialCode: materialCodes, //수정
          materialName: materialNames, //수정
        });
      } catch (error) {
        console.error("원자재 데이터 로딩 실패", error); //수정
      }
    };

    fetchData();
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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        원자재 재고 현황
      </Typography>
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
          <NewSearchBar
            searchOptions={[
              { label: "거래처명", value: "companyName" }, //수정
              { label: "품목코드", value: "materialCode" }, //수정
              { label: "품목명", value: "materialName" }, //수정
            ]}
            autoCompleteMap={autoCompleteMap}
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

      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={filteredMaterials}
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
