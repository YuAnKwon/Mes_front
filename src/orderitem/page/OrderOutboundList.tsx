import {
  DataGrid,
  useGridApiRef,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Pagination from "../../common/Pagination";
import { Box, Button, Typography } from "@mui/material";
import SearchBar from "../../common/SearchBar";
import * as XLSX from "xlsx-js-style";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteOrderItemOut,
  getOrderItemOutList,
  updateOrderItemOut,
} from "../api/OrderInApi";
import type { OrderItemList } from "../type";
import { createStyledWorksheet } from "../../common/ExcelUtils";

export default function OrderOutboundList() {
  const navigate = useNavigate();
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

  const handleSearch = (criteria: string, query: string) => {
    console.log("검색 실행:", { criteria, query });
  };

  const loadData = async () => {
    try {
      const oiList = await getOrderItemOutList();

      // 서버 데이터 → DataGrid rows 형식으로 매핑
      const mappedRows = oiList.map((item) => ({
        id: item.id,
        outNum: item.outNum,
        itemName: item.itemName,
        itemCode: item.itemCode,
        company: item.company,
        type: item.type,
        outAmount: item.outAmount,
        outDate: item.outDate
          ? (() => {
              const [datePart, timePart] = item.outDate.split(" ");
              const [year, month, day] = datePart.split("-").map(Number);
              const [hour, minute, second] = timePart.split(":").map(Number);
              return new Date(year, month - 1, day, hour, minute, second);
            })()
          : null,

        remark: item.remark,
      }));

      setRows(mappedRows);
    } catch (error) {
      console.error("출고 데이터 로딩 실패", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

      // 성공 시 로컬 상태에서 삭제
      setRows((prev) => prev.filter((row) => row.id !== id));

      // 편집 상태도 초기화
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

  const columns: GridColDef[] = [
    {
      field: "outNum",
      headerName: "출고번호",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "itemName",
      headerName: "품목명",
      width: 150,
      headerAlign: "center",
      align: "center",
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
      headerName: "출고수량 (개)",
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
          onClick={() => {
            navigate(`/shipmentInvoice/${params.row.id}`);
          }}
        >
          출하증
        </Button>
      ),
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
        </Box>
      </Box>
      <Box sx={{ height: 1200, width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
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
