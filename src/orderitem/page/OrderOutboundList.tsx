import {
  DataGrid,
  useGridApiRef,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Pagination from "../../common/Pagination";
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import * as XLSX from "xlsx-js-style";
import { useEffect, useState } from "react";
import {
  deleteOrderItemOut,
  getOrderItemOutList,
  updateOrderItemOut,
} from "../api/OrderInApi";
import type { OrderItemList } from "../type";
import { createStyledWorksheet } from "../../common/ExcelUtils";
import NewSearchBar from "../../common/NewSearchBar";
import ShipmentInvoice from "./ShipmentInvoice";

export default function OrderOutboundList() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const apiRef = useGridApiRef();
  const [filteredMaterials, setFilteredMaterials] = useState<OrderItemList[]>(
    []
  ); //수정
  const [openInvoice, setOpenInvoice] = useState(false); // 모달 상태 추가

  const handleCloseInvoice = () => {
    setSelectedId(null);
    setOpenInvoice(false); // 모달 닫기
  };

  const [autoCompleteMap, setAutoCompleteMap] = useState<
    Record<string, string[]>
  >({
    companyName: [], //수정
    materialCode: [], //수정
    materialName: [], //수정
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const oiList = await getOrderItemOutList(); //수정
        setRows(oiList); //수정

        const mappedRows = oiList.map((item) => ({
          id: item.id,
          outNum: item.outNum,
          itemName: item.itemName,
          itemCode: item.itemCode,
          company: item.company,
          type: item.type,
          outAmount: item.outAmount,
          outDate: item.outDate ? new Date(item.outDate) : null,
          remark: item.remark,
        }));

        // ✅ 각 필드별 중복 없는 자동완성 리스트 만들기
        const companyNames = Array.from(new Set(oiList.map((m) => m.company))); //수정
        const materialCodes = Array.from(
          new Set(oiList.map((m) => m.itemCode))
        ); //수정
        const materialNames = Array.from(
          new Set(oiList.map((m) => m.itemName))
        ); //수정
        const outNums = Array.from(
          new Set(oiList.map((m) => m.outNum))
        ) as string[];
        const outDates = Array.from(
          new Set(
            oiList
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
        ) as string[]; //수정

        setFilteredMaterials(mappedRows); //초기값

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

  const handleSearch = (criteria: string, query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      setFilteredMaterials(rows);
      return;
    }

    const filtered = rows.filter((item) => {
      const value = item[criteria as keyof OrderItemList];
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

  const [rows, setRows] = useState<OrderItemList[]>([]);
  const [editedRows, setEditedRows] = useState<{ [key: number]: boolean }>({});

  const handleEditRow = async (row: OrderItemList) => {
    try {
      await updateOrderItemOut(row.id, {
        outAmount: row.outAmount!,
        outDate: row.outDate as string,
      });

      alert("수정 완료");

      // 편집 상태 초기화
      setEditedRows((prev) => ({ ...prev, [row.id]: false }));
    } catch (error) {
      console.error("수정 실패", error);
      alert("수정에 실패하였습니다.");
    }
  };
  const handleDeleteRow = async (id: number) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteOrderItemOut(id);

      // rows 상태 갱신
      setRows((prev) => prev.filter((row) => row.id !== id));

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
      alert("삭제에 실패했습니다.");
    }
  };

  // 모달 상태변경
  const handleOpenInvoice = (id: number) => {
    setSelectedId(id);
    setOpenInvoice(true);
  };

  const columns: GridColDef[] = [
    {
      field: "outNum",
      headerName: "출고번호",
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
      field: "outAmount",
      headerName: "출고수량",
      width: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "number",
    },
    {
      field: "outDate",
      headerName: "출고일자",
      width: 200,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "date",
      renderCell: (params) => {
        if (!params.value) return "";
        const date =
          params.value instanceof Date ? params.value : new Date(params.value);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      },
    },
    {
      field: "shipmentInvoice",
      headerName: "출하증",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleOpenInvoice(params.row.id)}
        >
          출하증
        </Button>
      ),
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
              onClick={() => handleEditRow(params.row)}
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
    if (!rows || rows.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return; // 더 이상 진행하지 않음
    }
    const excelData = rows.map((item) => ({
      출고번호: item.outNum,
      품목명: item.itemName,
      품목번호: item.itemCode,
      거래처명: item.company,
      분류: item.type,
      "출고수량(개)": item.outAmount,
      출고일자: item.outDate ? new Date(item.outDate).toLocaleDateString() : "",
    }));

    const worksheet = createStyledWorksheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "수주대상품목_출고_목록.xlsx");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        수주대상 품목 출고 조회
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
          apiRef={apiRef}
          rows={filteredMaterials}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20, 30]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 20 } },
            sorting: {
              sortModel: [
                {
                  field: "outNum",
                  sort: "desc",
                },
              ],
            },
          }}
          processRowUpdate={(newRow, oldRow) => {
            // 값이 바뀌면 editedRows 활성화
            if (
              newRow.outAmount !== oldRow.outAmount ||
              newRow.outDate?.toString() !== oldRow.outDate?.toString()
            ) {
              setEditedRows((prev) => ({ ...prev, [newRow.id]: true }));
            }

            // rows 상태 갱신
            setRows((prev) =>
              prev.map((row) => (row.id === newRow.id ? newRow : row))
            );
            return newRow;
          }}
          slotProps={{
            basePagination: {
              material: {
                ActionsComponent: Pagination,
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

      {/* 출하증 모달 */}
      <Dialog
        open={openInvoice}
        onClose={handleCloseInvoice}
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
      >
        <DialogContent dividers>
          <ShipmentInvoice
            open={openInvoice}
            onClose={handleCloseInvoice}
            id={selectedId}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
