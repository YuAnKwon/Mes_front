import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import Pagination from "../../common/Pagination";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";
import { getMasterOrItList, updateOrItState } from "../api/OrderItemApi";
import type { MasterOrItList } from "../type";
import SearchBar from "../../common/SearchBar";

export default function MasterOrderItemList() {
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
      const oiList = await getMasterOrItList();

      // 서버 데이터 → DataGrid rows 형식으로 매핑
      const mappedRows = oiList.map((item) => ({
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
      }));

      setRows(mappedRows);
    } catch (error) {
      console.error("수주품목대상 데이터 조회 실패", error);
    }
  };

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
            onClick={() =>
              navigate(`/master/orderitem/detail/${params.row.id}`)
            }
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
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "", // 헤더 텍스트 없음
      width: 150,
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
      width: 250,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => (
        <Typography
          sx={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxHeight: 60,
            overflowY: "auto",
            p: 1,
          }}
        >
          {params.value}
        </Typography>
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
    navigate("/master/orderitem/register");
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2>수주대상품목 조회</h2>
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
            수주대상품목 등록
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
          // onRowSelectionModelChange={(newSelectionModel) => {
          //   setSelectedIds(newSelectionModel);
          // }}
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
