import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Button, Tab, Tabs, Typography } from "@mui/material";
import Pagination from "../../common/Pagination";
import { useNavigate } from "react-router-dom";
import type { MasterCpList } from "../type";
import { getMasterCpList, updateCompanyState } from "../api/companyApi";

export default function MasterCompanyList() {
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const mcList = await getMasterCpList();

      // 서버 데이터 → DataGrid rows 형식으로 매핑
      const mappedRows = mcList.map((item) => ({
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
      field: "id",
      headerName: "id",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "companyType",
      headerName: "업체 유형",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "companyName",
      headerName: "거래처명",
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
            onClick={() => navigate(`/master/company/detail/${params.row.id}`)}
          >
            {params.value}
          </Typography>
        </Box>
      ),
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
      field: "actions",
      headerName: "", // 헤더 텍스트 없음
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params) => {
        const isActive = params.row.businessYn === "거래 중";
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

  const handleState = async (row) => {
    const updatedState = row.businessYn === "거래 중" ? "Y" : "N";
    try {
      //api 호출로 백엔드에 변경 요청
      await updateCompanyState(row.id, updatedState);
      // 2. 변경된 전체 리스트 다시 불러오기
      const refreshedRows = await getMasterCpList();
      // 3. 상태 갱신
      setRows(refreshedRows);

      alert("거래 상태가 변경되었습니다");
    } catch (error) {
      console.error(error);
      alert("상태 변경 실패");
    }
  };

  const handleRegister = async () => {
    navigate("/master/company/register");
  };

  // 탭기능
  const [currentTab, setCurrentTab] = useState<number>(0);

  const tabList = ["전체", "거래처", "매입처"];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const filteredRows =
    currentTab === 0
      ? rows
      : rows.filter((row) => row.companyType === tabList[currentTab]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        업체 조회
      </Typography>

      {/* 버튼 영역 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
      {/* 탭 메뉴 */}

      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        {tabList.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      {/* 테이블 영역 */}
      <Box sx={{ height: 1200, width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          rows={filteredRows}
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
