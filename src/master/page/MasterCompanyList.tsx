import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import type {
  GridColDef
} from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import Pagination from "../../common/Pagination";
import { useNavigate } from "react-router-dom";
import type { MasterCpList } from "../type";
import { getMasterCpList } from "../api/MasterApi";

export default function MasterCompanyList() {
  
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const oiList = await getMasterCpList();

      // 서버 데이터 → DataGrid rows 형식으로 매핑
      const mappedRows = oiList.map((item) => ({
        id: item.id,
        companyName: item.companyName,
        companyType: item.companyType,
        ceoName: item.ceoName,
        address: item.address,
        remark: item.remark,
        businessYn: item.businessYn,
      }));

      setRows(mappedRows);
    } catch (error) {
      console.error("업체 데이터 조회 실패", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [rows, setRows] = useState<MasterCpList[]>([]);
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
            onClick={() => navigate(`/master/company/detail/${params.row.id}`)}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
// id: item.id,
// companyName: item.companyName,
// companyType: item.companyType,
// ceoName: item.ceoName,
// address: item.address,
// remark: item.remark,
// businessYn: item.businessYn, 

    {
      field: "companyType",
      headerName: "업체 유형",
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
      field: "ceoName",
      headerName: "대표명",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "address",
      headerName: "기업 주소",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "businessYn",
      headerName: "거래 상태",
      width: 150,
      headerAlign: "center",
      align: "center",
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


  const handleRegister = async () => {
    // ✅ DataGrid에서 선택된 행 ID 가져오기
    // const selectedRowsMap = apiRef.current.getSelectedRows();
    // const selectedRows = Array.from(selectedRowsMap.values());

    // if (selectedRows.length === 0) {
    //   alert("등록할 품목을 선택해주세요.");
    //   return;
    // }

    // const payload: OrderItemInRegister[] = selectedRows.map((row) => ({
    //   id: row.id,
    //   inAmount: row.inAmount as number,
    //   inDate: row.inDate as string,
    // }));

    // try {
    //   await registerInboundItem(payload);
    //   alert("입고 등록이 완료되었습니다.");
    //   navigate("/orderitem/inbound/list");
    // } catch (error) {
    //   console.error(error);
    //   alert("등록 중 오류가 발생하였습니다.");
    // }
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2>업체 조회</h2>
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
    
        {/* 버튼 영역 */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="outlined"
            color="primary"
            sx={{ height: 40, fontWeight: 500, px: 2.5 }}
            onClick={handleRegister}
          >
            업체 등록
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
