import { useEffect, useState } from "react";
import type { MaterialInList } from "../type";
import {
  DataGrid,
  useGridApiRef,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import Pagination from "../../common/Pagination";
import * as XLSX from "xlsx-js-style";
import { getMaterialInData } from "../api/MaterialInboundregisterApi";
import {
  softDeleteMaterialIn,
  updateMaterialIn,
} from "../api/MaterialInboundListApi";
import { createStyledWorksheet } from "../../common/ExcelUtils";
import NewSearchBar from "../../common/NewSearchBar";

export function MaterialInboundList() {
  const [materialsIn, setMaterialsIn] = useState<MaterialInList[]>([]);
  const [editedRows, setEditedRows] = useState<{ [key: number]: boolean }>({});
  const apiRef = useGridApiRef();
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialInList[]>(
    []
  );
  const [autoCompleteMap, setAutoCompleteMap] = useState<
    Record<string, string[]>
  >({
    companyName: [], //수정
    materialCode: [], //수정
    materialName: [], //수정
    inNum: [],
    inDate: [],
  });

  const handleSaveRow = async (row: MaterialInList) => {
    try {
      // API 호출
      await updateMaterialIn(row.id, {
        inAmount: row.inAmount,
        inDate: row.inDate,
        manufactureDate: row.manufactureDate,
      });

      // 저장 완료 후 체크 표시 or 토스트
      alert("저장 완료");
      // 편집 상태 초기화
      setEditedRows((prev) => ({ ...prev, [row.id]: false }));
    } catch (error) {
      console.error("저장 실패", error);
      alert("저장 실패");
    }
  };

  const handleDeleteRow = async (id: number) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await softDeleteMaterialIn(id);

      // rows 상태 갱신
      setMaterialsIn((prev) => prev.filter((row) => row.id !== id));

      // filteredMaterials도 갱신
      setFilteredMaterials((prev) => prev.filter((row) => row.id !== id));

      // 편집 상태 초기화
      setEditedRows((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });

      alert("삭제 완료");
    } catch (error) {
      console.error("삭제 실패", error);
      alert("삭제 실패");
    }
  };

  const handleSearch = (criteria: string, query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      setFilteredMaterials(materialsIn);
      return;
    }

    const filtered = materialsIn.filter((item) => {
      const value = item[criteria as keyof MaterialInList];
      if (!value) return false;

      // ✅ 입고일자 검색일 경우
      if (criteria === "inDate") {
        const dateObj = new Date(value as string | Date);

        // 변환된 날짜를 다양한 형식으로 저장
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, "0");
        const d = String(dateObj.getDate()).padStart(2, "0");

        const dateStr = `${y}-${m}-${d}`;
        const dateStrSlash = `${y}/${m}/${d}`;
        const shortStr = `${m}-${d}`;

        // ✅ 검색어가 이 중 하나라도 포함되면 true
        return (
          dateStr.includes(trimmedQuery) ||
          dateStrSlash.includes(trimmedQuery) ||
          shortStr.includes(trimmedQuery)
        );
      }
      return value.toString().toLowerCase().includes(trimmedQuery);
    });
    setFilteredMaterials(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMaterialInData(); //수정

        // ✅ 각 필드별 중복 없는 자동완성 리스트 만들기
        const companyNames = Array.from(
          new Set(data.map((m) => m.companyName))
        ) as string[]; //수정
        const materialCodes = Array.from(
          new Set(data.map((m) => m.materialCode))
        ) as string[]; //수정
        const materialNames = Array.from(
          new Set(data.map((m) => m.materialName))
        ) as string[]; //수정
        const inNums = Array.from(
          new Set(data.map((m) => m.inNum))
        ) as string[];
        const inDates = Array.from(
          new Set(
            data
              .map((m) => m.inDate)
              .filter(Boolean)
              .map((dateString) => {
                const date = new Date(dateString!);
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                return `${yyyy}-${mm}-${dd}`;
              })
          )
        ) as string[];

        const mappedRows = data.map((item) => ({
          id: item.id,
          inNum: item.inNum,
          companyName: item.companyName,
          inAmount: item.inAmount,
          scale: item.scale,
          inDate: item.inDate ? new Date(item.inDate) : null, // ✅ Date 객체로 변환
          materialName: item.materialName,
          materialCode: item.materialCode,
          specAndScale: item.specAndScale,
          manufacturer: item.manufacturer,
          manufactureDate: item.manufactureDate
            ? new Date(item.manufactureDate)
            : null,
          totalStock: item.totalStock,
        }));
        setMaterialsIn(mappedRows);
        setFilteredMaterials(mappedRows);
        setAutoCompleteMap({
          companyName: companyNames, //수정
          materialCode: materialCodes, //수정
          materialName: materialNames, //수정
          inNum: inNums,
          inDate: inDates,
        });
      } catch (error) {
        console.error("원자재 데이터 로딩 실패", error); //수정
      }
    };

    fetchData();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "inNum",
      headerName: "입고번호",
      width: 200,
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
      type: "number",
    },
    {
      field: "inAmount",
      headerName: "입고수량",
      width: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "number",
    },
    {
      field: "totalStock",
      headerName: "총량",
      width: 150,
      headerAlign: "center",
      align: "center",

      renderCell: (params) => {
        const { row } = params;
        const scale = row.scale || "";
        const value = Number(params.value) || 0;
        return `${value.toLocaleString()}${scale}`; // 예: "500kg"
      },
    },
    {
      field: "inDate",
      headerName: "입고일자",
      width: 150,
      headerAlign: "center",
      editable: true,
      align: "center",
      type: "date", // 실제 값은 시간 포함

      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}`;
      },
    },
    {
      field: "manufactureDate",
      headerName: "제조일자",
      width: 150,
      headerAlign: "center",
      editable: true,
      align: "center",
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

    {
      field: "actions",
      headerName: "수정 / 삭제",
      width: 170,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => {
        const isEdited = editedRows[params.row.id] || false;
        return (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* 수정 버튼 */}
            <Button
              variant="outlined"
              color="primary"
              size="small"
              disabled={!isEdited}
              onClick={() => handleSaveRow(params.row)}
            >
              수정
            </Button>
            &nbsp;
            {/* 삭제 버튼 */}
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDeleteRow(params.row.id)}
            >
              삭제
            </Button>
          </Box>
        );
      },
    },
  ];

  const handleExcelDownload = () => {
    if (!materialsIn || materialsIn.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return; // 더 이상 진행하지 않음
    }
    const excelData = materialsIn.map((item) => ({
      입고번호: item.inNum,
      품목명: item.materialName,
      품목번호: item.materialCode,
      매입처명: item.companyName,
      "원자재 규격": item.specAndScale,
      제조사: item.manufacturer,
      입고수량: item.inAmount,
      총량: item.totalStock,
      입고일자: item.inDate ? new Date(item.inDate).toLocaleDateString() : "",
      제조일자: item.manufactureDate
        ? new Date(item.manufactureDate).toLocaleDateString()
        : "",

      // "거래처명": item.companyName ?? "", // null 방지
    }));

    const worksheet = createStyledWorksheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "원자재_입고_등록현황.xlsx");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        원자재 입고 조회
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
              { label: "품목번호", value: "materialCode" }, //수정
              { label: "품목명", value: "materialName" }, //수정
              { label: "입고번호", value: "inNum" },
              { label: "입고일자", value: "inDate" },
            ]}
            autoCompleteMap={autoCompleteMap}
            onSearch={handleSearch}
          />
        </Box>

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
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          processRowUpdate={(newRow, oldRow) => {
            // 값이 바뀌면 editedRows 활성화
            if (
              newRow.inAmount !== oldRow.inAmount ||
              newRow.inDate?.toString() !== oldRow.inDate?.toString() ||
              newRow.manufactureDate?.toString() !==
                oldRow.manufactureDate?.toString()
            ) {
              setEditedRows((prev) => ({ ...prev, [newRow.id]: true }));
            }
            // rows 상태 갱신
            setMaterialsIn((prev) =>
              prev.map((row) => (row.id === newRow.id ? newRow : row))
            );
            return newRow;
          }}
          rows={filteredMaterials}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          apiRef={apiRef}
          pagination
          pageSizeOptions={[10, 20, 30]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 15 } },
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
