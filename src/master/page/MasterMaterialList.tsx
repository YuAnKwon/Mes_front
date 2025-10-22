import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import Pagination from "../../common/Pagination";
import type { MasterMtList } from "../type";
import { getMasterMtList, updateMaterialState } from "../api/MaterialApi";
import { CloseIcon } from "flowbite-react";
import MasterMaterial from "./MasterMaterial";
import NewSearchBar from "../../common/NewSearchBar";
import { createStyledWorksheet } from "../../common/ExcelUtils";
import * as XLSX from "xlsx-js-style";
import MasterMaterialDetail from "./MasterMaterialDetail";

export default function MasterMaterialList() {
  const [openRegister, setOpenRegister] = useState(false);
  const [filteredMaterials, setFilteredMaterials] = useState<MasterMtList[]>(
    []
  );
  const [autoCompleteMap, setAutoCompleteMap] = useState<
    Record<string, string[]>
  >({
    companyName: [], //수정
    materialCode: [], //수정
    materialName: [], //수정
  });
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);

  const handleRegisterComplete = async () => {
    handleCloseRegister(); // 모달 닫기
    await loadData(); // 리스트 갱신
  };

  const handleSearch = (criteria: string, query: string) => {
    if (!query.trim()) {
      setFilteredMaterials(rows); // 검색어 없으면 전체 리스트 수정
      return;
    }

    const filtered = rows.filter((item) =>
      item[criteria as keyof MasterMtList] //수정
        ?.toString()
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    setFilteredMaterials(filtered);
  };

  const loadData = async () => {
    try {
      const mcList = await getMasterMtList(); //수정

      const mappedRows: MasterMtList[] = mcList.map((item: any) => ({
        id: item.id,
        materialCode: item.materialCode, // API code → 타입 materialCode
        materialName: item.materialName, // API name → 타입 materialName
        companyName: item.companyName, // API company → 타입 companyName
        type: item.type,
        color: item.color,
        useYn: item.useYn,
        remark: item.remark,
      }));
      setRows(mappedRows); //수정

      // ✅ 각 필드별 중복 없는 자동완성 리스트 만들기
      const companies = Array.from(new Set(mcList.map((m) => m.companyName))); //수정
      const materialCodes = Array.from(
        new Set(mcList.map((m) => m.materialCode))
      ); //수정
      const materialNames = Array.from(
        new Set(mcList.map((m) => m.materialName))
      ); //수정
      const useYns = Array.from(new Set(mcList.map((m) => m.useYn)));

      setFilteredMaterials(mappedRows); //초기값

      setAutoCompleteMap({
        companyName: companies, //수정
        materialCode: materialCodes, //수정
        materialName: materialNames, //수정
        useYn: useYns,
      });
    } catch (error) {
      console.error("업체 데이터 조회 실패", error); //수정
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const [rows, setRows] = useState<MasterMtList[]>([]);
  const apiRef = useGridApiRef();
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id",
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
      field: "materialName",
      headerName: "품목명",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "inherit",
            }}
            onClick={() => handleOpenDetail(params.row.id)}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "companyName",
      headerName: "매입처명",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "type",
      headerName: "분류",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "color",
      headerName: "색상",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "useYn",
      headerName: "거래상태",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const value = params.value;
        let color = "#000"; // 기본 검정
        if (value === "거래 종료") color = "#ee0000"; // 거래 완료 빨간색
        else if (value === "거래 중") color = "#000"; // 거래 중 초록

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
            <Typography
              sx={{
                color,
                // fontWeight: 600,
                textAlign: "center",
                fontSize: "inherit",
              }}
            >
              {value}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "actions",
      headerName: "거래 상태 변경", // 헤더 텍스트 없음
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isActive = params.row.useYn === "거래 중";
        const buttonStyle = {
          color: isActive ? "#ee0000" : "#4169E1",
          borderColor: isActive ? "#ee0000" : "#4169E1",
        };
        const buttonText = isActive ? "거래 종료" : "거래 재개";

        return (
          <Button
            variant="outlined"
            size="small"
            style={buttonStyle}
            onClick={() => handleState(params.row)}
          >
            {buttonText}
          </Button>
        );
      },
    },
    {
      field: "remark",
      headerName: "비고",
      width: 300, // 컬럼 고정 폭
      headerAlign: "center",
      align: "left",
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            overflowX: "auto", // 가로 스크롤
            overflowY: "hidden",
          }}
        >
          <Box
            sx={{
              display: "inline-block", // 실제 내용 길이만큼 폭 확장
              whiteSpace: "nowrap", // 줄바꿈 방지
              px: 0.5,
            }}
          >
            {params.value}
          </Box>
        </Box>
      ),
    },
  ];

  const handleState = async (row) => {
    const updatedState = row.useYn === "거래 중" ? "Y" : "N";
    try {
      //api 호출로 백엔드에 변경 요청
      await updateMaterialState(row.id, updatedState);
      await loadData();

      alert("거래 상태가 변경되었습니다");
    } catch (error) {
      console.error(error);
      alert("상태 변경 실패");
    }
  };

  const handleExcelDownload = () => {
    if (!rows || rows.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return; // 더 이상 진행하지 않음
    }
    const excelData = rows.map((item) => ({
      // Id: item.id, 필요하면 주석풀기
      품목번호: item.materialCode,
      품목명: item.materialName,

      매입처명: item.companyName,
      분류: item.type,

      색상: item.color,

      거래상태: item.useYn,
      비고: item.remark,
    }));

    const worksheet = createStyledWorksheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "원자재_목록(기준정보관리).xlsx");
  };

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleOpenDetail = (id: number) => {
    setSelectedItemId(id);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedItemId(null);
    setOpenDetail(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        원자재 조회
      </Typography>
      {/* 버튼 영역 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
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
              { label: "거래상태", value: "useYn" },
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
          <Button
            variant="outlined"
            color="primary"
            sx={{ height: 40, fontWeight: 500, px: 2.5 }}
            onClick={handleOpenRegister}
          >
            수주대상품목 등록
          </Button>
        </Box>
      </Box>

      {/* 테이블 영역 */}
      <Box sx={{ height: 1200, width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          rows={filteredMaterials}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20, 30]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 20 } },
          }}
          slotProps={{
            basePagination: {
              material: {
                ActionsComponent: Pagination,
              },
            },
          }}
        />
      </Box>
      {/* 등록 모달 */}
      <Dialog
        open={openRegister}
        onClose={handleCloseRegister}
        maxWidth="lg"
        // fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          원자재 등록
          <IconButton onClick={handleCloseRegister}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ overflowY: "auto" }}>
          <MasterMaterial onRegisterComplete={handleRegisterComplete} />
        </DialogContent>
      </Dialog>

      {/* 등록 상세페이지 */}
      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="lg"
        // fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          수주대상품목 상세정보
          <IconButton onClick={handleCloseDetail}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ overflowY: "auto" }}>
          {selectedItemId && (
            <MasterMaterialDetail
              itemId={selectedItemId}
              onClose={handleCloseDetail}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
