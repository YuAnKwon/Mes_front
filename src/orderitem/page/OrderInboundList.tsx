import {
  DataGrid,
  useGridApiRef,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Pagination from "../../common/Pagination";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx-js-style";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteOrderItemIn,
  getOrderItemInList,
  updateOrderItemIn,
} from "../api/OrderInApi";
import type { OrderItemList } from "../type";
import { createStyledWorksheet } from "../../common/ExcelUtils";
import NewSearchBar from "../../common/NewSearchBar";
import { CloseIcon } from "flowbite-react";
import WorkOrder from "./WorkOrder";

export default function OrderInboundList() {
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const [filteredMaterials, setFilteredMaterials] = useState<OrderItemList[]>(
    []
  );
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedLotNum, setSelectedLotNum] = useState<string>("");

  const handleOpenWorkOrder = (id: number, lotNum: string) => {
    setSelectedId(id);
    setSelectedLotNum(lotNum);
    setOpenModal(true);
  };

  const handleClose = () => setOpenModal(false);
  const [autoCompleteMap, setAutoCompleteMap] = useState<
    Record<string, string[]>
  >({
    company: [], //수정
    itemCode: [], //수정
    itemName: [], //수정
    lotNum: [],
    inDate: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const oiList = await getOrderItemInList();
        setRows(oiList);
        // 서버 데이터 → DataGrid rows 형식으로 매핑
        const mappedRows = oiList.map((item) => ({
          id: item.id,
          lotNum: item.lotNum as string,
          itemName: item.itemName,
          itemCode: item.itemCode,
          company: item.company,
          type: item.type,
          inAmount: item.inAmount as number,
          inDate: item.inDate ? new Date(item.inDate) : null,
          remark: item.remark as string,
        }));
        setFilteredMaterials(mappedRows); //초기값

        // ✅ 각 필드별 중복 없는 자동완성 리스트 만들기
        const companys = Array.from(new Set(oiList.map((m) => m.company))); //수정
        const itemCodes = Array.from(new Set(oiList.map((m) => m.itemCode))); //수정
        const itemNames = Array.from(new Set(oiList.map((m) => m.itemName))); //수정
        const lotNums = Array.from(
          new Set(oiList.map((m) => m.lotNum))
        ) as string[];
        const inDates = Array.from(
          new Set(
            oiList
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
        );
        setAutoCompleteMap({
          company: companys, //수정
          itemCode: itemCodes, //수정
          itemName: itemNames, //수정
          lotNum: lotNums,
          inDate: inDates,
        });
      } catch (error) {
        console.error("입고 데이터 로딩 실패", error); //수정
      }
    };

    loadData();
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
      await updateOrderItemIn(row.id, {
        inAmount: row.inAmount!,
        inDate: row.inDate as string,
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
      await deleteOrderItemIn(id);

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
      field: "lotNum",
      headerName: "LOT 번호",
      width: 200,
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
            onClick={() => navigate(`/orderitem/process/${params.row.id}`)}
          >
            {params.value}
          </Typography>
        </Box>
      ),
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
      field: "workOrder",
      headerName: "작업지시서",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleOpenWorkOrder(params.row.id, params.row.lotNum)}
        >
          작업지시서
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
      "LOT 번호": item.lotNum,
      품목명: item.itemName,
      품목번호: item.itemCode,
      거래처명: item.company,
      분류: item.type,
      "입고수량(개)": item.inAmount,
      입고일자: item.inDate ? new Date(item.inDate).toLocaleDateString() : "",

      // "거래처명": item.companyName ?? "", // null 방지
    }));

    const worksheet = createStyledWorksheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "수주대상품목_입고_목록.xlsx");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        수주대상 품목 입고 조회
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
              { label: "품목코드", value: "itemCode" }, //수정
              { label: "품목명", value: "itemName" }, //수정
              { label: "Lot 번호", value: "lotNum" },
              { label: "입고일자", value: "inDate" },
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
                  field: "lotNum",
                  sort: "desc",
                },
              ],
            },
          }}
          processRowUpdate={(newRow, oldRow) => {
            // 값이 바뀌면 editedRows 활성화
            if (
              newRow.inAmount !== oldRow.inAmount ||
              newRow.inDate?.toString() !== oldRow.inDate?.toString()
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

      {/* ✅ 모달 추가 */}
      <Dialog
        open={openModal}
        onClose={handleClose}
        // fullWidth

        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
      >
        <DialogContent dividers sx={{}}>
          {" "}
          {selectedId && <WorkOrder id={selectedId} lotNum={selectedLotNum} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
