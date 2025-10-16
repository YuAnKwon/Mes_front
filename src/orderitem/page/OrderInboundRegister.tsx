import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import Pagination from "../../common/Pagination";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";
import SearchBar from "../../common/SearchBar";

import { getOrderItemInRegiList, registerInboundItem } from "../api/OrderInApi";
import type { OrderItemList, OrderItemInRegister } from "../type";

export default function OrderInboundRegister() {
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

  const loadData = async () => {
    try {
      const oiList = await getOrderItemInRegiList();

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

      setRows(mappedRows);
    } catch (error) {
      console.error("수주 데이터 로딩 실패", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [rows, setRows] = useState<OrderItemList[]>([]);
  const apiRef = useGridApiRef();
  const columns: GridColDef[] = [
    {
      field: "itemName",
      headerName: "품목명",
      width: 150,
      headerAlign: "center",
      align: "center",
      //언더바(상세 페이지)
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
            onClick={() => navigate(`/orderitem/detail/${params.row.id}`)}
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
      headerName: "입고수량 (개)",
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
      width: 250,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            height: "100%", // 셀 전체 높이 기준
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowY: "auto",
            p: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              display: "block",
              lineHeight: 1.4,
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
  ];

  const handleExcelDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "수주대상품목_목록.xlsx");
  };

  const handleRegister = async () => {
    // ✅ DataGrid에서 선택된 행 정보 가져오기
    const selectedRowsMap = apiRef.current.getSelectedRows();
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
    <Box sx={{ p: 2 }}>
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
            입고
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
    </Box>
  );
}
