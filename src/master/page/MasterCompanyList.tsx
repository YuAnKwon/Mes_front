import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Tab,
  Tabs,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import Pagination from "../../common/Pagination";
import type { MasterCpList } from "../type";
import {
  getClientList,
  getMasterCpList,
  getSupplierList,
  updateCompanyState,
} from "../api/companyApi";
import SearchBar from "../../common/SearchBar";
import MasterCompany from "./MasterCompany";
import CloseIcon from "@mui/icons-material/Close";
import MasterCompanyDetail from "./MasterCompanyDetail";

export default function MasterCompanyList() {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [rows, setRows] = useState<MasterCpList[]>([]);
  const [openRegister, setOpenRegister] = useState(false); // ✅ 등록 모달 상태 추가

  const loadData = async () => {
    try {
      let data: MasterCpList[] = [];

      if (currentTab === 0) data = await getMasterCpList();
      else if (currentTab === 1) data = await getClientList();
      else if (currentTab === 2) data = await getSupplierList();

      const mappedRows = data.map((item) => ({
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
  }, [currentTab]);

  const handleRegisterComplete = async () => {
    handleCloseRegister(); // 모달 닫기
    await loadData(); // 리스트 갱신
  };
  const apiRef = useGridApiRef();

  const handleState = async (row) => {
    const updatedState = row.businessYn === "거래 중" ? "Y" : "N";
    try {
      await updateCompanyState(row.id, updatedState);
      await loadData(); // ✅ 변경 후 리스트 다시 불러오기
      alert("거래 상태가 변경되었습니다");
    } catch (error) {
      console.error(error);
      alert("상태 변경 실패");
    }
  };

  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "companyType",
      headerName: "업체 유형",
      width: 120,
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
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => handleOpenDetail(params.row.id)}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "ceoName",
      headerName: "대표명",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "address",
      headerName: "기업 주소",
      width: 300,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "businessYn",
      headerName: "거래 상태",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const value = params.value;

        // 글자만 표시 + 세련된 색상
        const colorMap: Record<string, { text: string; textColor: string }> = {
          "거래 중": { text: "거래 중", textColor: "#000" }, // 진한 초록
          "거래 종료": { text: "거래 종료", textColor: "#" }, // 진한 주황/적갈색
          default: { text: "-", textColor: "#616161" }, // 중간 회색
        };

        const { text, textColor } = colorMap[value] || colorMap.default;

        return (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center", // 세로 가운데
              justifyContent: "center", // 가로 가운데
            }}
          >
            <Typography
              sx={{
                color: textColor,
                fontSize: "0.95rem",
              }}
            >
              {text}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "거래 상태 변경",
      width: 150,
      sortable: false,
      headerAlign: "center",
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

  const tabList = ["전체", "거래처", "매입처"];
  const handleTabChange = (_e, newValue: number) => setCurrentTab(newValue);

  const sampleData = ["회사1", "회사2", "품목A", "품목B"];
  const searchOptions = [
    { label: "매입처명", value: "companyName" },
    { label: "품목번호", value: "materialCode" },
    { label: "품목명", value: "materialName" },
  ];

  const handleSearch = (criteria: string, query: string) => {
    console.log("검색 실행:", { criteria, query });
  };

  const filteredRows =
    currentTab === 0
      ? rows
      : rows.filter((row) => row.companyType === tabList[currentTab]);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleOpenDetail = (id: number) => {
    setSelectedItemId(id);
    setOpenDetail(true);
  };

  const handleCloseDetail = async (refresh = false) => {
    setSelectedItemId(null);
    setOpenDetail(false);

    if (refresh) {
      await loadData(); // 모달 수정 후 테이블 갱신
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        업체 조회
      </Typography>

      {/* 검색 + 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <SearchBar
            searchOptions={searchOptions}
            autoCompleteData={sampleData}
            onSearch={handleSearch}
          />
        </Box>
        <Button
          variant="outlined"
          color="primary"
          sx={{ height: 40, fontWeight: 500, px: 2.5, ml: 2 }}
          onClick={handleOpenRegister}
        >
          업체 등록
        </Button>
      </Box>

      {/* 탭 */}
      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        {tabList.map((label, i) => (
          <Tab key={i} label={label} />
        ))}
      </Tabs>

      {/* 테이블 */}
      <Box sx={{ height: 800 }}>
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

      {/*  등록 모달 */}
      <Dialog
        open={openRegister}
        onClose={handleCloseRegister}
        maxWidth="lg"
        // fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          업체 등록
          <IconButton onClick={handleCloseRegister}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: "80vh", overflowY: "auto" }}>
          <MasterCompany onRegisterComplete={handleRegisterComplete} />
        </DialogContent>
      </Dialog>

      {/* 상세페이지 */}
      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="lg"
        // fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          업체 상세정보
          <IconButton onClick={handleCloseDetail}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ overflowY: "auto" }}>
          {selectedItemId && (
            <MasterCompanyDetail
              companyId={selectedItemId}
              onClose={handleCloseDetail}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
