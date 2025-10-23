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
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";
import { getOrderItemInRegiList, registerInboundItem } from "../api/OrderInApi";
import type { OrderItemList, OrderItemInRegister } from "../type";
import { createStyledWorksheet } from "../../common/ExcelUtils";
import NewSearchBar from "../../common/NewSearchBar";
import OrderDetail from "./OrderDetail";
import { CloseIcon } from "flowbite-react";

export default function OrderInboundRegister() {
  const [filteredMaterials, setFilteredMaterials] = useState<OrderItemList[]>(
    []
  );
  const navigate = useNavigate();
  const [autoCompleteMap, setAutoCompleteMap] = useState<
    Record<string, string[]>
  >({
    company: [], //수정
    itemCode: [], //수정
    itemName: [], //수정
  });

  // 상태 추가
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // 품목명 클릭 시
  const handleItemClick = (id: number) => {
    setSelectedItemId(id);
    setDetailOpen(true);
  };

  // 모달 닫기
  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedItemId(null);
  };
  const handleSearch = (criteria: string, query: string) => {
    if (!query.trim()) {
      setFilteredMaterials(rows); // 검색어 없으면 전체 리스트 수정
      return;
    }

    const filtered = rows.filter((item) =>
      item[criteria as keyof OrderItemList] //수정
        ?.toString()
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    setFilteredMaterials(filtered);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const oiList = await getOrderItemInRegiList();
        setRows(oiList);
        // 서버 데이터 → DataGrid rows 형식으로 매핑
        const mappedRows = oiList.map((item) => ({
          id: item.id,
          itemName: item.itemName,
          itemCode: item.itemCode,
          company: item.company,
          type: item.type,
          inAmount: undefined, // 수량
          inDate: "", // 입고일자
          remark: item.remark,
        }));
        setFilteredMaterials(mappedRows); //초기값

        // ✅ 각 필드별 중복 없는 자동완성 리스트 만들기
        const companys = Array.from(new Set(oiList.map((m) => m.company))); //수정
        const itemCodes = Array.from(new Set(oiList.map((m) => m.itemCode))); //수정
        const itemNames = Array.from(new Set(oiList.map((m) => m.itemName))); //수정

        setAutoCompleteMap({
          company: companys, //수정
          itemCode: itemCodes, //수정
          itemName: itemNames, //수정
        });
      } catch (error) {
        console.error("수주 데이터 로딩 실패", error); //수정
      }
    };

    loadData();
  }, []);

  const [rows, setRows] = useState<OrderItemList[]>([]);
  const apiRef = useGridApiRef();
  const columns: GridColDef[] = [
    {
      field: "itemName",
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
            onClick={() => handleItemClick(params.row.id)}
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
      width: 150,
      headerAlign: "center",
      align: "center",
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
      비고: item.remark,
    }));

    const worksheet = createStyledWorksheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "수주대상품목_목록.xlsx");
  };

  const handleRegister = async () => {
    // ✅ DataGrid에서 선택된 행 정보 가져오기
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
    const payload: OrderItemInRegister[] = selectedRows.map((row) => ({
      id: row.id,
      inAmount: row.inAmount as number,
      inDate: row.inDate as string,
    }));

    // 유효성 검사
    for (const row of payload) {
      if (!row.inAmount || !row.inDate) {
        alert("입고 수량과 입고일자를 모두 입력해주세요.");
        return;
      }
      console.log(payload);
    }

    try {
      await registerInboundItem(payload);
      console.log(payload);
      alert("입고 등록이 완료되었습니다.");
      navigate("/orderitem/inbound/list");
    } catch (error) {
      console.error(error);
      alert("등록 중 오류가 발생하였습니다.");
    }
  };

  return (
    <Box
      sx={{
        mx: "auto", // 가운데 정렬
        p: 2,
        display: "flex",
        flexDirection: "column", // 세로로 쌓이도록
      }}
    >
      {" "}
      <Typography variant="h5" sx={{ mb: 3 }}>
        수주대상 품목 입고 등록
      </Typography>
      {/* 버튼 영역 */}
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
              { label: "거래처명", value: "company" }, //수정
              { label: "품목코드", value: "itemCode" }, //수정
              { label: "품목명", value: "itemName" }, //수정
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
            onClick={handleRegister}
          >
            입고
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
          checkboxSelection
          pageSizeOptions={[10, 20, 30]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 15 } },
          }}
          slotProps={{
            basePagination: {
              material: {
                ActionsComponent: Pagination,
              },
            },
          }}
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
              fontSize: "18px",
              color: "#999",
            },
            "& .MuiDataGrid-cell--editing::after": {
              content: '""',
            },
          }}
        />
      </Box>
      <Dialog
        open={detailOpen}
        onClose={handleDetailClose}
        maxWidth="lg"
        // fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          품목 상세정보
          <IconButton
            aria-label="close"
            onClick={handleDetailClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <OrderDetail
            itemId={selectedItemId}
            open={detailOpen} // 내부에서 굳이 안 써도 됨
            onClose={handleDetailClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
