import { DataGrid, useGridApiRef, type GridColDef } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProcessStatus } from "../api/OrderInApi";
import type { ProcessStatus } from "../type";

export default function OrderOutboundList() {
  const { id } = useParams<{ id: string }>();
  const apiRef = useGridApiRef();

  const loadData = async () => {
    try {
      const routingList = await getProcessStatus(Number(id));

      // 서버 데이터 → DataGrid rows 형식으로 매핑
      const mappedRows = routingList.map((routing) => ({
        id: routing.id, // 공정 id
        processCode: routing.processCode,
        processName: routing.processName,
        processTime: routing.processTime,
        remark: routing.remark,
        start_time: routing.start_time,
        completed_status: routing.completed_status,
      }));

      setRows(mappedRows);
    } catch (error) {
      console.error("공정 데이터 로딩 실패", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [rows, setRows] = useState<ProcessStatus[]>([]);
  const [editedRows, setEditedRows] = useState<{ [key: number]: boolean }>({});

  const handleEditRow = async (row: ProcessStatus) => {
    try {
      //   await updateOrderItemOut(row.id, {
      //     outAmount: row.outAmount!,
      //     outDate: row.outDate as string,
      //   });

      alert("수정 완료");

      // 편집 상태 초기화
      setEditedRows((prev) => ({ ...prev, [row.id]: false }));
    } catch (error) {
      console.error("수정 실패", error);
      alert("수정에 실패하였습니다.");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
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
    {
      field: "start_time",
      headerName: "공정 시작시간",
      width: 200,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "dateTime",
    },
    {
      field: "actions",
      headerName: "공정 진행 상태",
      width: 150,
      headerAlign: "center",
      align: "center",
      // 대기 진행 완료 (드롭다운)
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        공정 진행현황 조회
      </Typography>
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
            sorting: {
              sortModel: [
                {
                  field: "id",
                  sort: "asc",
                },
              ],
            },
          }}
          processRowUpdate={(newRow, oldRow) => {
            // 값이 바뀌면 editedRows 활성화
            if (
              newRow.outAmount !== oldRow.outAmount ||
              newRow.outDate?.toString() !== oldRow.outDate?.toString()
            ) {
              setEditedRows((prev) => ({ ...prev, [newRow.id]: true }));
            }

            // rows 상태 갱신
            setRows((prev) =>
              prev.map((row) => (row.id === newRow.id ? newRow : row))
            );
            return newRow;
          }}
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
      {/* 버튼 */}
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={handleProcessNext}>
          다음 공정으로 진행
        </Button>
      </Box>
    </Box>
  );
}
