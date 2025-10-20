import {
  Autocomplete,
  Box,
  createFilterOptions,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { useState } from "react";

interface SearchBarProps {
  searchOptions: { label: string; value: string }[]; // 드롭다운 옵션
  autoCompleteMap: Record<string, string[]>; // ✅ criteria별 자동완성 데이터
  onSearch: (criteria: string, query: string) => void; // 검색 실행 함수
}

export default function NewSearchBar({
  searchOptions = [],
  autoCompleteMap = {},
  onSearch,
}: SearchBarProps) {
  const [criteria, setCriteria] = useState(searchOptions[0].value);
  const [query, setQuery] = useState("");
  const filter = createFilterOptions<string>();
  const handleSearch = () => {
    onSearch(criteria, query);
  };

  // ✅ 현재 선택된 기준에 맞는 자동완성 리스트
  const currentAutoCompleteList = autoCompleteMap[criteria] || [];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        height: 40,
        width: 500,
      }}
    >
      {/* 드롭다운 */}
      <Select
        value={criteria}
        onChange={(e) => setCriteria(e.target.value)}
        size="small"
        sx={{
          minWidth: 130,
          height: "100%",
          fontSize: 14,
          backgroundColor: "#fff",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            height: "100%",
            pl: 1.5,
          },
        }}
      >
        {searchOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>

      {/* 자동완성 텍스트필드 */}
      <Autocomplete
        freeSolo
        options={currentAutoCompleteList} // ✅ 기준에 따라 자동완성 리스트 변경
        filterOptions={(options, params) => {
          const filtered = filter(options, params); // ✅ 기본 필터링 유지
          return filtered.slice(0, 5); // ✅ 그중 상위 5개만 표시
        }}
        sx={{
          flex: 1,
          height: "100%",

          "& .MuiInputBase-root": {
            height: "100%",
            paddingRight: "40px !important",
          },
        }}
        onInputChange={(_, value) => setQuery(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            placeholder="검색어를 입력해주세요"
            sx={{
              "& .MuiInputBase-input": {
                py: 0,
                height: "100%",
                width: 300,
              },
            }}
            InputProps={{
              ...params.InputProps,
              sx: { height: "100%", p: 0 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <GridSearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Box>
  );
}
