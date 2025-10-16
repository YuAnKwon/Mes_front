import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import Pagination from "../../common/Pagination";
import { useNavigate } from "react-router-dom";
import type { MasterMtList } from "../type";
import { getMasterMtList, updateMaterialState } from "../api/MaterialApi";


export default function MasterMaterialList() {
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const mcList = await getMasterMtList();

      // 서버 데이터 → DataGrid rows 형식으로 매핑
      const mappedRows = mcList.map((item) => ({
        id: item.id,
        itemCode: item.itemCode,
        itemName: item.itemName,
        company: item.company,
        type: item.type,
        color: item.color,
        completedStatus: item.completedStatus,
        remark: item.remark,

      }));

      setRows(mappedRows);
    } catch (error) {
      console.error("업체 데이터 조회 실패", error);
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
      field: "itemCode",
      headerName: "품목번호",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "itemName",
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
            onClick={() => navigate(`/master/material/detail/${params.row.id}`)}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "company",
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
      field: "completedStatus",
      headerName: "거래상태",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: 'actions',
      headerName: '', // 헤더 텍스트 없음
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      renderCell: (params) => {
        const isActive = params.row.businessYn === '거래 중';
        const buttonStyle = {
          color: isActive ? '#ee0000' : '#4169E1',
          borderColor: isActive ? '#ee0000' : '#4169E1',
        };
        const buttonText = isActive ? '거래 종료' : '거래 재개';

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

  const handleState = async (row) => {
    const updatedState = row.businessYn === '거래 중' ? 'Y' : 'N';
      try {
        //api 호출로 백엔드에 변경 요청
        await updateMaterialState(row.id, updatedState)
        // 2. 변경된 전체 리스트 다시 불러오기
        const refreshedRows = await getMasterMtList();
        // 3. 상태 갱신
        setRows(refreshedRows);

        alert('거래 상태가 변경되었습니다');
      } catch (error) {
        console.error(error);
        alert('상태 변경 실패');
      }
  };

  const handleRegister = async () => {
    navigate("/master/material/register");
  };

  
  return (
    <Box sx={{ p: 2 }}>
      <h2>원자재 조회</h2>
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
        {/* 버튼 영역 */}
        <Box sx={{ ml: "auto" }}>
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
      
      {/* 테이블 영역 */}
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
    </Box>
  );
}
