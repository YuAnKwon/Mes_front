import { Box, Button } from "@mui/material";
import {
  DataGrid,
  useGridApiRef,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Pagination from "../../common/Pagination";
import * as XLSX from "xlsx-js-style";
import { useEffect, useState } from "react";
import type { MaterialOutList } from "../type";
import {
  getMaterialOutDatas,
  softDeleteMaterialOut,
  updateMaterialOut,
} from "../api/MaterialOutboundListApi";
import { createStyledWorksheet } from "../../common/ExcelUtils";
import NewSearchBar from "../../common/NewSearchBar";

export function MaterialOutboundList() {
  const [materialsOuts, setMaterialsOuts] = useState<MaterialOutList[]>([]);
  const [editedRows, setEditedRows] = useState<{ [key: number]: boolean }>({});
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialOutList[]>(
    []
  );
  const apiRef = useGridApiRef();

  const [autoCompleteMap, setAutoCompleteMap] = useState<
    Record<string, string[]>
  >({
    companyName: [], //수정
    materialCode: [], //수정
    materialName: [], //수정
    outNum: [],
    outDate: [],
  });

  const handleSaveRow = async (row: MaterialOutList) => {
    try {
      // API 호출
      await updateMaterialOut(row.id, {
        outAmount: row.outAmount,
        outDate: row.outDate,
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
      await softDeleteMaterialOut(id);

      // 로컬 상태 갱신
      setMaterialsOuts((prev) => prev.filter((row) => row.id !== id));
      setFilteredMaterials((prev) => prev.filter((row) => row.id !== id)); // ✅ 필터링된 상태도 갱신

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMaterialOutDatas(); //수정

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
        const outNums = Array.from(new Set(data.map((m) => m.outNum)));
        const outDates = Array.from(
          new Set(
            data
              .map((m) => m.outDate)
              .filter(Boolean)
              .map((dateString) => {
                const date = new Date(dateString!);
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                return `${yyyy}-${mm}-${dd}`;
              })
          )
        );

        const mappedRows = data.map((item) => ({
          id: item.id,
          outNum: item.outNum,
          outAmount: item.outAmount,
          companyName: item.companyName,
          outDate: item.outDate ? new Date(item.outDate) : null, // ✅ Date 객체로 변환
          materialName: item.materialName,
          materialCode: item.materialCode,
          manufacturer: item.manufacturer,
        }));
        setMaterialsOuts(mappedRows);
        setFilteredMaterials(mappedRows); //수정
        setAutoCompleteMap({
          companyName: companyNames, //수정
          materialCode: materialCodes, //수정
          materialName: materialNames, //수정
          outNum: outNums,
          outDate: outDates,
        });
      } catch (error) {
        console.error("원자재 데이터 로딩 실패", error); //수정
      }
    };

    fetchData();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "outNum",
      headerName: "출고번호",
      width: 180,
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

    {
      field: "actions",
      headerName: "수정 / 삭제",
      width: 140,
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
    if (!materialsOuts || materialsOuts.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return; // 더 이상 진행하지 않음
    }
    const excelData = materialsOuts.map((item) => ({
      출고번호: item.outNum,
      품목명: item.materialName,
      품목번호: item.materialCode,
      매입처명: item.companyName,
      제조사: item.manufacturer,
      출고수량: item.outAmount,
      출고일자: item.outDate ? new Date(item.outDate).toLocaleDateString() : "",

      // "거래처명": item.companyName ?? "", // null 방지
    }));

    const worksheet = createStyledWorksheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "원자재_출고_등록_목록.xlsx");
  };

  const handleSearch = (criteria: string, query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      setFilteredMaterials(materialsOuts);
      return;
    }

    const filtered = materialsOuts.filter((item) => {
      const value = item[criteria as keyof MaterialOutList];
      if (!value) return false;

      // ✅ 출고일자 검색일 경우
      if (criteria === "outDate") {
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

      // ✅ 일반 문자열 검색
      return value.toString().toLowerCase().includes(trimmedQuery);
    });

    setFilteredMaterials(filtered);
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2>원자재 출고 조회</h2>
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
              { label: "매입처명", value: "companyName" }, //수정
              { label: "품목번호", value: "materialCode" }, //수정
              { label: "품목명", value: "materialName" }, //수정
              { label: "출고번호", value: "outNum" },
              { label: "출고일자", value: "outDate" },
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

      <Box sx={{ height: 1200, width: "100%" }}>
        <DataGrid
          processRowUpdate={(newRow, oldRow) => {
            // 값이 바뀌면 editedRows 활성화
            if (
              newRow.outAmount !== oldRow.outAmount ||
              newRow.outDate?.toString() !== oldRow.outDate?.toString()
            ) {
              setEditedRows((prev) => ({ ...prev, [newRow.id]: true }));
            }
            // rows 상태 갱신
            setMaterialsOuts((prev) =>
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
