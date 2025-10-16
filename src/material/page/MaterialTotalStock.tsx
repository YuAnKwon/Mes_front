import { useGridApiRef, type GridColDef } from "@mui/x-data-grid";

export function MaterialTotalStock() {
  const apiRef = useGridApiRef();
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
  const columns: GridColDef[] = [
    {
      field: "inNum",
      headerName: "입고번호",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "materialName",
      headerName: "품목명",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
  ];
  return <></>;
}
