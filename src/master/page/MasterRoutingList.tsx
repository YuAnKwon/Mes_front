import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Box, Button, Typography, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import type { MasterRouting } from "../type";
import { deleteRouting, getRoutingList, newRouting } from "../api/RoutingApi";
import Pagination from "../../common/Pagination";

export default function MasterRoutingList() {
  const [rows, setRows] = useState<MasterRouting[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalRows, setModalRows] = useState<MasterRouting[]>([]);

  // 서버에서 공정 상태 데이터 불러오기 (조회용)
  const loadData = async () => {
    try {
      const routingList = await getRoutingList();
      const sortedList = routingList.sort((a, b) => b.id - a.id);
      setRows(sortedList);
    } catch (error) {
      console.error("공정 데이터 로딩 실패", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 조회 테이블 삭제 (API 호출)
  const handleDeleteRow = async (id: number) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteRouting(id);
      setRows((prev) => prev.filter((row) => row.id !== id));
      alert("삭제 완료");
    } catch (error) {
      console.error("삭제 실패", error);
      alert("삭제에 실패했습니다.");
    }
  };

  // 모달 열기
  const handleOpenModal = () => {
    const initialRows: MasterRouting[] = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      processCode: "",
      processName: "",
      processTime: undefined,
      remark: "",
    }));
    setModalRows(initialRows);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  // 모달 행 추가
  const handleModalAddRow = () => {
    setModalRows((prev) => {
      const newRow: MasterRouting = {
        id: prev.length + 1, // 항상 마지막 +1
        processCode: "",
        processName: "",
        processTime: undefined,
        remark: "",
      };
      return [...prev, newRow];
    });
  };

  // 모달 행 삭제 (로컬 상태만)
  const handleModalDeleteRow = (id: number) => {
    setModalRows((prev) => {
      // 해당 행 삭제
      const filtered = prev.filter((row) => row.id !== id);
      // ID 재할당 (1부터 순서대로)
      return filtered.map((row, index) => ({ ...row, id: index + 1 }));
    });
  };

  // 모달 저장
  const handleModalSave = async () => {
    // 비어있지 않은 행만 필터링
    const filledRows = modalRows.filter(
      (row) =>
        row.processCode || row.processName || row.processTime !== undefined
    );

    if (filledRows.length === 0) {
      alert("한 행 이상 입력해주세요.");
      return;
    }

    // 각 행 필수 체크
    for (let i = 0; i < filledRows.length; i++) {
      const row = filledRows[i];
      if (!row.processCode) {
        alert(`${i + 1}번행의 공정코드를 입력해주세요.`);
        return;
      }
      if (!row.processName) {
        alert(`${i + 1}번행의 공정명을 입력해주세요.`);
        return;
      }
      if (row.processTime === undefined || isNaN(row.processTime)) {
        alert(`${i + 1}번행의 공정시간을 숫자로 입력해주세요.`);
        return;
      }
    }

    const codes = filledRows.map((r) => r.processCode);
    const duplicates = codes.filter(
      (code, index) => codes.indexOf(code) !== index
    );
    if (duplicates.length > 0) {
      alert(`공정코드 "${duplicates[0]}" 가 중복되었습니다.`);
      return;
    }

    try {
      await newRouting(filledRows);
      alert("저장 완료되었습니다.");
      setOpenModal(false);
      loadData();
    } catch (error) {
      if (error.response?.data?.message?.includes("이미 존재하는 공정코드")) {
        alert("이미 존재하는 공정코드입니다.");
      } else {
        console.error("등록 실패", error);
        alert("등록 실패");
      }
    }
  };

  // 공통 컬럼 (조회/모달 공통)
  const commonColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "No",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "processCode",
      headerName: "공정코드",
      width: 150,
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
      field: "processName",
      headerName: "공정명",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "processTime",
      headerName: "공정시간 (분)",
      width: 150,
      headerAlign: "center",
      align: "center",
      type: "number",
    },
    {
      field: "remark",
      headerName: "비고",
      width: 500,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            p: 1,
          }}
        >
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
  ];

  // 조회 삭제 컬럼
  const viewColumns: GridColDef[] = [
    ...commonColumns,
    {
      field: "action",
      headerName: "삭제",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDeleteRow(params.row.id)}
        >
          삭제
        </Button>
      ),
    },
  ];

  // 모달 삭제 컬럼
  const modalColumns: GridColDef[] = [
    ...commonColumns,
    {
      field: "action",
      headerName: "행 제거",
      width: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => handleModalDeleteRow(params.row.id)}
        >
          <Typography color="error" fontSize="0.9rem">
            X
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        라우팅 관리
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={handleOpenModal}>
          라우팅 등록
        </Button>
      </Box>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={viewColumns.map((col) => ({ ...col, editable: false }))} // 조회용 수정 불가
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20, 30]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 15 } },
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

      {/* 모달 */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            라우팅 추가
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <Button variant="outlined" onClick={handleModalAddRow}>
              행 추가
            </Button>
          </Box>
          <DataGrid
            rows={modalRows}
            columns={modalColumns.map((col) =>
              col.field === "action"
                ? { ...col, editable: false }
                : { ...col, editable: true }
            )}
            getRowId={(row) => row.id}
            hideFooter
            processRowUpdate={(newRow) => {
              setModalRows((prev) =>
                prev.map((row) => (row.id === newRow.id ? newRow : row))
              );
              return newRow;
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" onClick={handleModalSave}>
              저장
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
