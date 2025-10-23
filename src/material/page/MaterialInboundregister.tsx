import { Box, Button, Typography } from "@mui/material";
import { DataGrid, useGridApiRef, type GridColDef } from "@mui/x-data-grid";
import Pagination from "../../common/Pagination";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx-js-style";

import { getMaterialData } from "../api/MaterialInboundListApi";
import type { MaterialList } from "../type";
import { useNavigate } from "react-router-dom";
import { postMaterialInData } from "../api/MaterialInboundregisterApi";
import { createStyledWorksheet } from "../../common/ExcelUtils";
import NewSearchBar from "../../common/NewSearchBar";

export function MaterialInboundregister() {
  const [materials, setMaterials] = useState<MaterialList[]>([]);
  const apiRef = useGridApiRef();
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialList[]>(
    []
  );
  const [autoCompleteMap, setAutoCompleteMap] = useState<
    Record<string, string[]>
  >({
    companyName: [],
    materialCode: [],
    materialName: [],
  });

  const handleRegister = async () => {
    // :흰색_확인_표시: DataGrid에서 선택된 행 정보 가져오기
    const selectedRowsMap = apiRef.current?.getSelectedRows();
    if (!selectedRowsMap) {
      alert("선택된 데이터가 없습니다.");
      return;
    }
    const selectedRows = Array.from(selectedRowsMap.values());
    if (selectedRows.length === 0) {
      alert("등록할 품목을 선택해주세요.");
      return;
    }
    // 선택된 행
    const payload: MaterialList[] = selectedRows.map((row) => ({
      id: row.id,
      materialCode: row.materialCode,
      materialName: row.materialName,
      inAmount: row.inAmount as number,
      inDate: row.inDate as string,
      manufactureDate: row.manufactureDate as string,
    }));
    // 유효성 검사
    for (const row of payload) {
      if (!row.inAmount || !row.inDate || !row.manufactureDate) {
        alert("입고 수량과 입고일자 제조 일자를 모두 입력해주세요.");
        return;
      }
      console.log(payload);
    }

    try {
      await postMaterialInData(payload);
      console.log(payload);
      alert("입고 등록이 완료되었습니다.");
      navigate("/material/inbound/list");
    } catch (error) {
      console.error(error);
      alert("등록 중 오류가 발생하였습니다.");
    }
  };

  const navigate = useNavigate();

  const handleSearch = (criteria: string, query: string) => {
    if (!query.trim()) {
      setFilteredMaterials(materials); // 검색어 없으면 전체 리스트 수정
      return;
    }

    const filtered = materials.filter((item) =>
      item[criteria as keyof MaterialList] //수정
        ?.toString()
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    setFilteredMaterials(filtered);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMaterialData();
        setMaterials(data);
        setFilteredMaterials(data);

        // ✅ 각 필드별 중복 없는 자동완성 리스트 만들기
        const companyNames = Array.from(
          new Set(data.map((m) => m.companyName))
        ) as string[];
        const materialCodes = Array.from(
          new Set(data.map((m) => m.materialCode))
        ) as string[];
        const materialNames = Array.from(
          new Set(data.map((m) => m.materialName))
        ) as string[];
        // setFilteredMaterials(data);
        setAutoCompleteMap({
          companyName: companyNames,
          materialCode: materialCodes,
          materialName: materialNames,
        });
      } catch (error) {
        console.error("원자재 데이터 로딩 실패", error);
      }
    };

    fetchData();
  }, []);

  const columns: GridColDef[] = [
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
      field: "specAndScale",
      headerName: "원자재 규격",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "manufacturer",
      headerName: "제조사",
      width: 150,
      headerAlign: "center",
      align: "center",
      type: "string",
    },
    {
      field: "inAmount",
      headerName: "입고 수량",
      width: 150,
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
      field: "manufactureDate",
      headerName: "제조 일자",
      width: 150,
      headerAlign: "center",
      align: "left",
      editable: true,
      type: "date",
    },
  ];

  const handleExcelDownload = () => {
    if (!materials || materials.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return; // 더 이상 진행하지 않음
    }
    const excelData = materials.map((item) => ({
      품목명: item.materialName,
      품목번호: item.materialCode,
      매입처명: item.companyName,
      "원자재 규격": item.specAndScale,
      제조사: item.manufacturer,
      // "거래처명": item.companyName ?? "", // null 방지
    }));

    const worksheet = createStyledWorksheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "원자재_입고_등록_목록.xlsx");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        원자재 입고 등록
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
        <NewSearchBar
          searchOptions={[
            { label: "거래처명", value: "companyName" },
            { label: "품목코드", value: "materialCode" },
            { label: "품목명", value: "materialName" },
          ]}
          autoCompleteMap={autoCompleteMap}
          onSearch={handleSearch}
        />

        {/* 버튼 영역 */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="contained"
            color="success"
            sx={{ height: 40, fontWeight: 500, px: 2.5 }}
            onClick={handleExcelDownload}
          >
            엑셀 다운로드
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ height: 40, fontWeight: 500, px: 2.5 }}
            onClick={handleRegister}
          >
            입고
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={filteredMaterials}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          apiRef={apiRef}
          checkboxSelection
          pagination
          pageSizeOptions={[10, 20, 30]}
          experimentalFeatures={{ newEditingApi: true }} // 👈 추가
          processRowUpdate={(newRow, oldRow) => {
            // inAmount 또는 inDate가 입력되면 자동 체크
            if (
              (newRow.inAmount !== undefined && newRow.inAmount !== null) ||
              (newRow.inDate && newRow.inDate !== "")
            ) {
              apiRef.current?.selectRow(newRow.id, true, false); // 기존 선택 유지
            }
            return newRow;
          }}
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
              fontSize: "18px",
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
