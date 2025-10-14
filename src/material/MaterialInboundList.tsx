import { useEffect, useState } from "react";
import { getMaterialData } from "./api/MaterialAddApi";
import type { MaterialList } from "./type";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import * as XLSX from "xlsx-js-style";

export function MaterialInboundList() {
  const [materialsIn, setMaterialsIn] = useState<MaterialList[]>([]);
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

  const handleSearch = (criteria: string, query: string) => {
    console.log("검색 실행:", { criteria, query });
  };

  const fetchMaterialData = async () => {
    try {
      const response = await getMaterialData();
      setMaterialsIn(response);
    } catch (error) {
      console.error("데이터 로딩 실패", error);
      alert("원자재 데이터를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchMaterialData();
  }, []);

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
      headerName: "매입처명",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "scal",
      headerName: "원자재 규격",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "maker",
      headerName: "제조사",
      width: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "number",
    },
    {
      field: "inAmount",
      headerName: "입고 수량",
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
      field: "makeDate",
      headerName: "제조 일자",
      width: 250,
      headerAlign: "center",
      align: "left",
      editable: true,
      type: "date",
    },
  ];

  const handleExcelDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(materialsIn);
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
          <Button
            variant="outlined"
            color="primary"
            sx={{ height: 40, fontWeight: 500, px: 2.5 }}
            onClick={handleRegister}
          >
            등록
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 1200, width: "100%" }}>
        <DataGrid
          rows={materialsIn}
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
