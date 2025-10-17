import { Box, Button } from "@mui/material";
import SearchBar from "../../common/SearchBar";
import { DataGrid, useGridApiRef, type GridColDef } from "@mui/x-data-grid";
import Pagination from "../../common/Pagination";
import * as XLSX from "xlsx-js-style";
import type { MaterialOut } from "../type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMaterialInData } from "../api/MaterialInboundregisterApi";
import { postMaterialOutData } from "../api/MaterialOutboundRegisterApi";
import { createStyledWorksheet } from "../../common/ExcelUtils";

export function MaterialOutboundRegister() {
  const [materialout, setMaterialout] = useState<MaterialOut[]>([]);
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
      field: "inNum",
      headerName: "입고번호",
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
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "manufacturer",
      headerName: "제조사",
      width: 120,
      headerAlign: "center",
      align: "center",
      type: "string",
    },
    {
      field: "outAmount",
      headerName: "출고 수량",
      width: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "number",
    },
    {
      field: "outDate",
      headerName: "출고일자",
      width: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "date",
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}`;
      },
    },
  ];

  //검색
  const handleSearch = (criteria: string, query: string) => {
    console.log("검색 실행:", { criteria, query });
  };

  const handleRegister = async () => {
    // :흰색_확인_표시: DataGrid에서 선택된 행 정보 가져오기
    const selectedRowsMap = apiRef.current.getSelectedRows();
    const selectedRows = Array.from(selectedRowsMap.values());
    if (selectedRows.length === 0) {
      alert("출고등록할 품목을 선택해주세요.");
      return;
    }
    // 선택된 행
    const payload: MaterialOut[] = selectedRows.map((row) => ({
      id: row.id,
      inNum: row.inNum,
      materialCode: row.materialCode,
      materialName: row.materialName,
      outAmount: row.outAmount as number,
      outDate: row.outDate as string,
    }));
    // 유효성 검사
    for (const row of payload) {
      if (!row.outAmount || !row.outDate) {
        alert("출고 수량과 출고일자를 모두 입력해주세요.");
        return;
      }
      console.log(payload);
    }

    try {
      await postMaterialOutData(payload);
      console.log(payload);
      alert("출고 등록이 완료되었습니다.");
      navigate("/material/outbound/list");
    } catch (error) {
      console.error(error);
      alert("출고 등록 중 오류가 발생하였습니다.");
    }
  };

  const fetchMaterialOutData = async () => {
    try {
      const response = await getMaterialInData();
      setMaterialout(response);
    } catch (error) {
      console.error("데이터 로딩 실패", error);
      alert("출고 데이터를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchMaterialOutData();
  }, []);

  const navigate = useNavigate();

  const handleExcelDownload = () => {
    if (!materialout || materialout.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return; // 더 이상 진행하지 않음
    }
    const excelData = materialout.map((item) => ({
      입고번호: item.inNum,
      품목명: item.materialName,
      품목번호: item.materialCode,
      매입처명: item.companyName,
      "재고량(개)": item.stock,
      제조사: item.manufacturer,

      // "거래처명": item.companyName ?? "", // null 방지
    }));

    const worksheet = createStyledWorksheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "원자재_출고_등록_목록.xlsx");
  };
  return (
    <Box sx={{ p: 2 }}>
      <h2>원자재 출고 등록</h2>
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
          rows={materialout}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          apiRef={apiRef}
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
