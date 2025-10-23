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
import * as XLSX from "xlsx-js-style";
import { getMasterOrItList, updateOrItState } from "../api/OrderItemApi";
import type { MasterOrItList } from "../type";
import NewSearchBar from "../../common/NewSearchBar";
import { createStyledWorksheet } from "../../common/ExcelUtils";
import { CloseIcon } from "flowbite-react";
import MasterOrderItem from "./MasterOrderItem";
import MasterOrderItemDetail from "./MasterOrderItemDetail";

export default function MasterOrderItemList() {
  const [filteredMaterials, setFilteredMaterials] = useState<MasterOrItList[]>(
    []
  );
  const [autoCompleteMap, setAutoCompleteMap] = useState<
    Record<string, string[]>
  >({
    company: [], //수정
    itemCode: [], //수정
    itemName: [], //수정
  });

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleSearch = (criteria: string, query: string) => {
    if (!query.trim()) {
      setFilteredMaterials(rows); // 검색어 없으면 전체 리스트 수정
      return;
    }

    const filtered = rows.filter((item) =>
      item[criteria as keyof MasterOrItList] //수정
        ?.toString()
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    setFilteredMaterials(filtered);
  };

  const [openRegister, setOpenRegister] = useState(false);

  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);

  const handleRegisterComplete = async () => {
    handleCloseRegister(); // 모달 닫기
    await loadData(); // 리스트 갱신
  };

  const handleOpenDetail = (id: number) => {
    setSelectedItemId(id);
    setOpenDetail(true);
  };

  const handleCloseDetail = async (refresh = false) => {
    setSelectedItemId(null);
    setOpenDetail(false);

    if (refresh) {
      await loadData(); // 모달 수정 후 테이블 갱신
    }
  };
  //loadData와 useEffect안의 FetchData 통합
  const loadData = async () => {
    try {
      const oiList = await getMasterOrItList();

      const mappedRows = oiList
        .map((item) => ({
          id: item.id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          company: item.company,
          type: item.type,
          unitPrice: item.unitPrice,
          color: item.color,
          coatingMethod: item.coatingMethod,
          remark: item.remark,
          useYn: item.useYn,
        }))
        .sort((a, b) => b.id - a.id);

      setRows(mappedRows);
      setFilteredMaterials(mappedRows);

      // ✅ 자동완성용 데이터도 함께 세팅
      const companys = Array.from(new Set(oiList.map((m) => m.company)));
      const itemCodes = Array.from(new Set(oiList.map((m) => m.itemCode)));
      const itemNames = Array.from(new Set(oiList.map((m) => m.itemName)));
      const useYns = Array.from(new Set(oiList.map((m) => m.useYn)));

      setAutoCompleteMap({
        company: companys,
        itemCode: itemCodes,
        itemName: itemNames,
        useYn: useYns,
      });
    } catch (error) {
      console.error("수주품목대상 데이터 조회 실패", error);
    }
  };

  // ✅ useEffect에서 그냥 loadData 한 줄만 호출
  useEffect(() => {
    loadData();
  }, []);

  const handleState = async (row) => {
    const updatedState = row.useYn === "거래 중" ? "Y" : "N";
    try {
      //api 호출로 백엔드에 변경 요청
      await updateOrItState(row.id, updatedState);
      // 2. 변경된 전체 리스트 다시 불러오기
      const refreshedRows = await getMasterOrItList();
      // 3. 상태 갱신
      setRows(refreshedRows);

      await loadData();
      alert("거래 상태가 변경되었습니다");
    } catch (error) {
      console.error(error);
      alert("상태 변경 실패");
    }
  };

  const [rows, setRows] = useState<MasterOrItList[]>([]);
  const apiRef = useGridApiRef();
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "No",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "itemName",
      headerName: "품목명",
      width: 180,
      headerAlign: "center",
      align: "center",
      //언더바(상세 페이지)
      sortComparator: (a, b) => {
        const numA = parseInt(a.replace(/[^0-9]/g, "")) || 0;
        const numB = parseInt(b.replace(/[^0-9]/g, "")) || 0;
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
      },
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
      field: "itemCode",
      headerName: "품목번호",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "company",
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
      field: "unitPrice",
      headerName: "품목단가",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "color",
      headerName: "색상",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "coatingMethod",
      headerName: "도장방식",
      width: 120,
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
      headerName: "거래 상태 변경",
      width: 150,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
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

  const handleExcelDownload = () => {
    if (!rows || rows.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return; // 더 이상 진행하지 않음
    }
    const excelData = rows.map((item) => ({
      품목명: item.itemName,
      품목번호: item.itemCode,
      거래처명: item.company,
      분류: item.type,
      품목단가: item.unitPrice,
      색상: item.color,
      도정방식: item.coatingMethod,
      거래상태: item.useYn,
      비고: item.remark,
    }));

    const worksheet = createStyledWorksheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "수주대상품목_목록(기준정보관리).xlsx");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        수주대상품목 조회
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
              { label: "거래처명", value: "company" }, //수정
              { label: "품목번호", value: "itemCode" }, //수정
              { label: "품목명", value: "itemName" }, //수정
              { label: "거래상태", value: "useYn" },
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
          <Button
            variant="contained"
            color="primary"
            sx={{ height: 40, fontWeight: 500, px: 2.5 }}
            onClick={handleOpenRegister}
          >
            수주대상품목 등록
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          rows={filteredMaterials}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20, 30]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 15 } },
          }}
          sortingOrder={["desc", "asc"]}
          // sortModel={[{ field: "id", sort: "desc" }]}
          slotProps={{
            basePagination: {
              material: {
                ActionsComponent: Pagination,
              },
            },
          }}
          //연필아이콘
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

      {/* 등록 모달 */}
      <Dialog open={openRegister} onClose={handleCloseRegister} maxWidth="lg">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          수주대상품목 등록
          <IconButton onClick={handleCloseRegister}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ overflowY: "auto" }}>
          <MasterOrderItem onRegisterComplete={handleRegisterComplete} />
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
            <MasterOrderItemDetail
              itemId={selectedItemId}
              onClose={handleCloseDetail}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
