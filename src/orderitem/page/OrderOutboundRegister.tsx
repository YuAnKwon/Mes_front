import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import Pagination from "../../common/Pagination";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";
import SearchBar from "../../common/SearchBar";

import { getOrderItemInList, registeroutboundItem } from "../api/OrderInApi";
import type { OrderItemList, OrderItemOutRegister } from "../type";
import { createStyledWorksheet } from "../../common/ExcelUtils";

export default function OrderOutboundRegister() {
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

  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState<OrderItemList[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const oiList = await getOrderItemInList();

      const mappedRows = oiList.map((item) => ({
        id: item.id,
        lotNum: item.lotNum,
        itemName: item.itemName,
        itemCode: item.itemCode,
        company: item.company,
        type: item.type,
        inAmount: item.inAmount,
        inDate: item.inDate,
        isProcessCompleted: item.isProcessCompleted ?? "N",
        outAmount: undefined,
        outDate: "",
      }));

      setRows(mappedRows);
    } catch (error) {
      console.error("입고 데이터 로딩 실패", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "lotNum",
      headerName: "LOT번호",
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
      type: "number",
    },
    {
      field: "inDate",
      headerName: "입고일자",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (params.value ? params.value.split(" ")[0] : ""),
    },
    {
      field: "isProcessCompleted",
      headerName: "공정진행상태",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const value = params.value;
        // 공정 상태에 따른 색상
        const colorMap: Record<
          string,
          { text: string; bg: string; textColor: string }
        > = {
          Y: { text: "공정 완료", bg: "#E6F4EA", textColor: "#2E7D32" }, // 연두/초록
          N: { text: "진행 중", bg: "#FFF4E5", textColor: "#FF9800" }, // 주황/연한 주황
          default: { text: "-", bg: "#F5F5F5", textColor: "#9E9E9E" }, // 회색
        };

        const { text, bg, textColor } = colorMap[value] || colorMap.default;

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
                bgcolor: bg,
                color: textColor,
                fontWeight: 600,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                textAlign: "center",
                width: "80%",
              }}
            >
              {text}
            </Typography>
          </Box>
        );
      },
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
      width: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "date",
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
    }));

    const worksheet = createStyledWorksheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "수주대상품목_입고_목록.xlsx");
  };

  const handleRegister = async () => {
    const selectedRowsMap = apiRef.current.getSelectedRows();
    const selectedRows = Array.from(selectedRowsMap.values());

    if (selectedRows.length === 0) {
      alert("등록할 품목을 선택해주세요.");
      return;
    }

    if (selectedRows.length === 0) {
      alert("등록할 품목을 선택해주세요.");
      return;
    }

    for (const row of selectedRows) {
      if (!row.outAmount || !row.outDate) {
        alert("출고 수량과 출고일자를 모두 입력해주세요.");
        return;
      }

      // ❗ 출고수량 검증
      if (row.outAmount > row.inAmount) {
        alert(
          `출고 수량이 입고 수량보다 많을 수 없습니다.\n품목: ${row.itemName}`
        );
        return;
      }

      // 출고일자 검증
      const inDate = new Date(row.inDate);
      const outDate = new Date(row.outDate);
      if (outDate < inDate) {
        alert(
          `출고일자는 입고일자보다 앞일 수 없습니다.\n품목: ${row.itemName}`
        );
        return;
      }
    }

    const payload: OrderItemOutRegister[] = selectedRows.map((row) => ({
      id: row.id,
      outAmount: row.outAmount as number,
      outDate: row.outDate as string,
    }));

    try {
      await registeroutboundItem(payload);
      alert("출고 등록이 완료되었습니다.");
      navigate("/orderitem/outbound/list");
    } catch (error) {
      console.error(error);
      alert("등록 중 오류가 발생하였습니다.");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        수주대상 품목 출고 등록
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
        <Box sx={{ flex: 1 }}>
          <SearchBar
            searchOptions={searchOptions}
            autoCompleteData={sampleData}
            onSearch={handleSearch}
          />
        </Box>

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
            출고
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
          checkboxSelection
          isRowSelectable={(params) => params.row.isProcessCompleted === "Y"}
          pageSizeOptions={[10, 20, 30]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 20 } },
            sorting: { sortModel: [{ field: "lotNum", sort: "desc" }] },
          }}
          getRowClassName={(params) =>
            params.row.isProcessCompleted === "N" ? "row-disabled" : ""
          }
          sx={{
            "& .MuiDataGrid-columnHeaders": { fontWeight: "bold" },
            "& .MuiDataGrid-cell--editable": { position: "relative" },
            "& .MuiDataGrid-cell--editable::after": {
              content: '"✎"',
              position: "absolute",
              right: 6,
              top: 6,
              fontSize: "12px",
              color: "#999",
            },
            "& .MuiDataGrid-cell--editing::after": { content: '""' },

            // 비활성화된 행
            "& .row-disabled": {
              opacity: 1,
              "& .MuiDataGrid-cell--editable::after": {
                content: '""', // 연필 아이콘 제거
              },
            },

            "& .row-disabled .MuiDataGrid-cell:first-of-type": {
              pointerEvents: "auto", // 첫 번째 셀(Lot번호)만 클릭 허용
            },

            "& .row-disabled .MuiDataGrid-checkboxInput": {
              display: "none", // 클릭 불가, 안 보이지만 자리 유지
            },
          }}
        />
      </Box>
    </Box>
  );
}
