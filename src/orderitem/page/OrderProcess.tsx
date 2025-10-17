import { DataGrid, useGridApiRef, type GridColDef } from "@mui/x-data-grid";
import { Box, Button, Chip, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProcessStatus, updateProcessStatus } from "../api/OrderInApi";
import type { ProcessStatus } from "../type";
import { Select, MenuItem } from "@mui/material";

export default function OrderProcess() {
  // URL 파라미터에서 id 가져오기
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 공정 상태 데이터
  const [rows, setRows] = useState<ProcessStatus[]>([]);

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
        completedStatus: row.completedStatus,
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

  // 드롭다운 변경
  const handleStatusChange = async (
    row: ProcessStatus,
    nextStatus: "N" | "ING" | "Y"
  ) => {
    let newStartTime: Date | null =
      row.startTime instanceof Date ? row.startTime : null;

    if ((nextStatus === "ING" || nextStatus === "Y") && !row.startTime) {
      newStartTime = new Date();
    } else if (nextStatus === "N") {
      newStartTime = null;
    }

    const updatedRow = {
      ...row,
      completedStatus: nextStatus,
      startTime: newStartTime,
    };

    setRows((prev) => prev.map((r) => (r.id === row.id ? updatedRow : r)));

    try {
      await updateProcessStatus(row.id, {
        startTime: newStartTime ? newStartTime.toISOString() : "",
        completedStatus: nextStatus,
      });
    } catch (error) {
      console.error("상태 변경 실패", error);
    }

    // 모든 공정 완료일경우
    const allCompleted =
      updatedRow.completedStatus === "Y" &&
      [...rows.map((r) => (r.id === row.id ? updatedRow : r))].every(
        (r) => r.completedStatus === "Y"
      );

    if (allCompleted) {
      const proceed = window.confirm(
        "모든 공정이 완료되었습니다. 출고하시겠습니까?"
      );
      if (proceed) {
        navigate(`/orderitem/outbound/register`);
      }
    }
  };

  // "다음 공정으로 진행" 버튼 클릭 시 처리
  const handleProcessNext = async () => {
    // 1. **현재 상태 기준**으로 공정 데이터 복사
    const currentRows = [...rows];

    // 2. 현재 'ING' 상태인 공정의 인덱스를 찾습니다.
    const currentIndex = currentRows.findIndex(
      (r) => r.completedStatus === "ING"
    );

    // 3. 현재 공정 완료 처리 및 다음 공정 찾기
    let nextIndex = -1;
    let hasUpdated = false;

    if (currentIndex !== -1) {
      // 3-A: 'ING' 공정이 있는 경우 (일반적인 순차 진행)
      // 현재 진행중 공정을 'Y' (완료)로 변경
      currentRows[currentIndex].completedStatus = "Y";
      // 서버에 'Y' 상태 업데이트
      try {
        await updateProcessStatus(currentRows[currentIndex].id, {
          startTime: currentRows[currentIndex].startTime
            ? new Date(currentRows[currentIndex].startTime).toISOString()
            : "",
          completedStatus: "Y",
        });
      } catch (error) {
        console.error("현재 공정 완료 처리 실패", error);
      }
      hasUpdated = true;

      // 다음 공정 인덱스 설정
      nextIndex = currentIndex + 1;
    } else {
      // 3-B: 'ING' 공정이 없는 경우 (모든 공정이 'N'이거나, 드롭다운으로 중간 공정을 'Y'로 변경했을 때)
      // **가장 먼저 'N' 상태인 공정**을 찾습니다. 이것이 다음 진행 공정입니다.
      const firstPendingIndex = currentRows.findIndex(
        (r) => r.completedStatus === "N"
      );

      if (firstPendingIndex !== -1) {
        // 'N' 공정을 찾았다면, 그 공정을 'ING'로 설정합니다.
        nextIndex = firstPendingIndex;
        hasUpdated = true;
      }
    }

    // 4. 다음 공정으로 이동 처리
    if (nextIndex !== -1 && nextIndex < currentRows.length) {
      const nextProcess = currentRows[nextIndex];

      // 다음 공정을 'ING' (진행중)으로 변경
      nextProcess.completedStatus = "ING";

      // 진행 시작 시간 없으면 현재 시간 설정
      if (!nextProcess.startTime) {
        nextProcess.startTime = new Date();
      }

      // ⭐ 수정된 부분: nextProcess.startTime이 Date 객체인지 확인합니다.
      if (nextProcess.startTime instanceof Date) {
        // 서버에 'ING' 상태 업데이트
        try {
          await updateProcessStatus(nextProcess.id, {
            // 타입 가드 덕분에 안전하게 toISOString() 호출 가능
            startTime: nextProcess.startTime.toISOString(),
            completedStatus: "ING",
          });
        } catch (error) {
          console.error("다음 공정 진행 처리 실패", error);
        }
      } else {
        // 이론적으로 이 코드는 실행되지 않지만, 만약을 위해 로그를 남기거나 처리할 수 있습니다.
        console.error("startTime이 유효한 Date 객체가 아닙니다.");
      }
    }

    // 5. 모두 완료 상태인지 재확인 (불필요한 setRows 방지)
    const allCompleted = currentRows.every((r) => r.completedStatus === "Y");
    if (allCompleted) {
      const proceed = window.confirm(
        "모든 공정이 완료되었습니다. 출고하시겠습니까?"
      );
      if (proceed) {
        navigate(`/orderitem/outbound/register`); // 출고 화면으로 이동
        return;
      }
    }

    if (hasUpdated || allCompleted) {
      // 6. 상태 갱신
      setRows(currentRows);
    }
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
      width: 220,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "dateTime",
    },
    {
      field: "completedStatus",
      headerName: "공정 진행 상태",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Select
          value={params.row.completedStatus}
          onChange={(event) =>
            handleStatusChange(
              params.row,
              event.target.value as "N" | "ING" | "Y"
            )
          }
          size="small"
          sx={{ width: "100%", fontSize: "14px" }}
        >
          <MenuItem value="N">대기</MenuItem>
          <MenuItem value="ING">진행중</MenuItem>
          <MenuItem value="Y">완료</MenuItem>
        </Select>
      ),
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
          hideFooter
          initialState={{
            sorting: {
              sortModel: [{ field: "id", sort: "asc" }],
            },
          }}
          // 행 단위 편집 처리
          processRowUpdate={async (newRow, oldRow) => {
            // DataGrid에서 넘어온 문자열을 Date 객체로 변환
            if (typeof newRow.startTime === "string" && newRow.startTime) {
              // new Date() 생성 시 유효한지 확인하고 변환
              const date = new Date(newRow.startTime);
              newRow.startTime = isNaN(date.getTime()) ? null : date;
            }

            // 편집된 startTime이 있고, 이전에는 없었으면 진행중으로 상태 변경
            if (newRow.startTime && !oldRow.startTime) {
              newRow.completedStatus = "ING";
              try {
                await updateProcessStatus(newRow.id, {
                  startTime: newRow.startTime.toISOString(),
                  completedStatus: "ING",
                });
              } catch (error) {
                console.error("시간 수정 자동저장 실패", error);
              }
            }

            // rows 상태 갱신
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
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Button variant="outlined" onClick={handleProcessNext}>
          다음 공정으로 진행
        </Button>
      </Box>
    </Box>
  );
}
