import { Box } from "@mui/material";
import Pagination from "../order_item/Pagination";
import { DataGrid } from "@mui/x-data-grid";


export function MaterialList() {

    return(
        <Box sx={{ p: 2 }}>
      <h2>수주대상 품목 입고 등록</h2>
      <Box sx={{ height: 1200, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          checkboxSelection
          pagination
          pageSizeOptions={[10, 20, 30]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 20 } },
          }}
          slotProps={{
            basePagination: {
              material: {
                ActionsComponent: Pagination, // 커스텀 페이징 적용
              },
            },
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </Box>
    )
}