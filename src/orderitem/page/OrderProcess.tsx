import { DataGrid, useGridApiRef, type GridColDef } from "@mui/x-data-grid";
import { Box, Button, Chip, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProcessStatus } from "../api/OrderInApi";
import type { ProcessStatus } from "../type";
import { Select, MenuItem } from "@mui/material";

export default function OrderProcess() {
  // URL 파라미터에서 id 가져오기
  const { id } = useParams<{ id: string }>();

  // 공정 상태 데이터
  const [rows, setRows] = useState<ProcessStatus[]>([]);

  // 편집 상태를 추적
  const [editedRows, setEditedRows] = useState<{ [key: number]: boolean }>({});

  const apiRef = useGridApiRef(); // DataGrid API 참조

  // 서버에서 공정 상태 데이터 불러오기
  const loadData = async () => {
    try {
      const routingList = await getProcessStatus(Number(id));

      // startTime을 문자열 -> Date 객체로 변환 (dateTime 컬럼에서 필수)
      const processed = routingList.map((row) => ({
        ...row,
        startTime:
          row.startTime && row.startTime !== "null"
            ? new Date(row.startTime)
            : null,
      }));

      setRows(processed);
    } catch (error) {
      console.error("공정 데이터 로딩 실패", error);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  // 단일 행 수정 처리 (outAmount, outDate 같은 필드)
  const handleEditRow = async (row: ProcessStatus) => {
    try {
      // 서버 업데이트 예시
      // await updateOrderItemOut(row.id, { outAmount: row.outAmount!, outDate: row.outDate as string });

      alert("수정 완료");

      // 편집 상태 초기화
      setEditedRows((prev) => ({ ...prev, [row.id]: false }));
    } catch (error) {
      console.error("수정 실패", error);
      alert("수정에 실패하였습니다.");
    }
  };

  // "다음 공정으로 진행" 버튼 클릭 시 처리
  const handleProcessNext = async () => {
    // 현재 진행중인 공정 인덱스 찾기
    const currentIndex = rows.findIndex((r) => r.completedStatus === "진행중");
    let updatedRows = [...rows];

    const now = new Date().toISOString(); // 현재 시간

    if (currentIndex !== -1) {
      // 현재 진행중 공정을 완료로 변경
      updatedRows[currentIndex].completedStatus = "완료";
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < rows.length) {
      // 다음 공정을 대기 -> 진행중으로 변경
      updatedRows[nextIndex].completedStatus = "진행중";

      // 진행 시작 시간 없으면 현재 시간 설정
      updatedRows[nextIndex].startTime = new Date();
    }

    setRows(updatedRows);

    // 서버 업데이트 예시
    // for (const r of updatedRows) {
    //    await updateProcessStatus(r.id, r);
    // }
  };

  // Select 드롭다운에서 상태 변경 시 처리
  const handleStatusChange = async (row: ProcessStatus, newStatus: string) => {
    const updatedRow = { ...row, completed_status: newStatus };

    // 진행중이나 완료로 상태 변경 시 시작시간 없으면 현재 시간 설정
    if ((newStatus === "진행중" || newStatus === "Y") && !row.startTime) {
      updatedRow.startTime = new Date();
    }

    setRows((prev) => prev.map((r) => (r.id === row.id ? updatedRow : r)));

    // 서버 업데이트 예시
    // await updateProcessStatus(row.id, updatedRow);
  };

  // 시작 시간 수동 변경 처리
  const handleStartTimeChange = async (
    row: ProcessStatus,
    newStartTime: string
  ) => {
    const updatedRow = { ...row, start_time: newStartTime };
    setRows((prev) => prev.map((r) => (r.id === row.id ? updatedRow : r)));
    // 서버 업데이트 예시
    // await updateProcessStatus(row.id, updatedRow);
  };

  // DataGrid 컬럼 정의
  const columns: GridColDef[] = [
    {
      field: "routingOrder",
      headerName: "공정순서",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "processCode",
      headerName: "공정코드",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "processName",
      headerName: "공정명",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "processTime",
      headerName: "공정시간 (분)",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "remark",
      headerName: "비고",
      width: 300,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowY: "auto",
            p: 1,
          }}
        >
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "startTime",
      headerName: "공정 시작시간",
      width: 200,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "dateTime", // 반드시 Date 객체여야 함
    },
    {
      field: "completedStatus",
      headerName: "공정 진행 상태",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        // 상태 변경 시 Select 드롭다운 이벤트
        const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
          const next = event.target.value as "N" | "ING" | "Y";

          // 시작시간이 Date 객체인지 확인
          let newStartTime: Date | null =
            params.row.startTime instanceof Date ? params.row.startTime : null;

          // 진행중 또는 완료로 변경 시 시작시간 없으면 현재시간 설정
          if ((next === "ING" || next === "Y") && !params.row.startTime) {
            newStartTime = new Date();
          } else if (next === "N") {
            // 대기로 돌아가면 시작시간 제거
            newStartTime = null;
          }

          const updatedRow = {
            ...params.row,
            completedStatus: next,
            startTime: newStartTime,
          };

          setRows((prev) =>
            prev.map((r) => (r.id === params.row.id ? updatedRow : r))
          );
        };

        return (
          <Select
            value={params.row.completedStatus}
            onChange={handleChange}
            size="small"
            sx={{ width: "100%" }}
          >
            <MenuItem value="N">대기</MenuItem>
            <MenuItem value="ING">진행중</MenuItem>
            <MenuItem value="Y">완료</MenuItem>
          </Select>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        공정 진행현황 조회
      </Typography>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: "id", sort: "asc" }],
            },
          }}
          // 행 단위 편집 처리
          processRowUpdate={(newRow, oldRow) => {
            if (
              newRow.outAmount !== oldRow.outAmount ||
              newRow.outDate?.toString() !== oldRow.outDate?.toString()
            ) {
              setEditedRows((prev) => ({ ...prev, [newRow.id]: true }));
            }

            setRows((prev) =>
              prev.map((row) => (row.id === newRow.id ? newRow : row))
            );
            return newRow;
          }}
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
          }}
        />
      </Box>

      {/* 다음 공정으로 진행 버튼 */}
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={handleProcessNext}>
          다음 공정으로 진행
        </Button>
      </Box>
    </Box>
  );
}
