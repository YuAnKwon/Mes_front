// -------------------- 커스텀 페이징 컴포넌트 --------------------

import {
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import MuiPagination from "@mui/material/Pagination";

export default function Pagination({
  page,
  onPageChange,
  className,
}: {
  page: number;
  onPageChange: (event: any, newPage: number) => void;
  className?: string;
}) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1} // DataGrid는 0부터, MuiPagination은 1부터
      onChange={(event, newPage) => onPageChange(event, newPage - 1)}
    />
  );
}
