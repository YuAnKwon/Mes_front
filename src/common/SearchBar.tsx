import {
  Autocomplete,
  Box,
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
  autoCompleteData: string[]; // 자동완성 데이터
  onSearch: (criteria: string, query: string) => void; // 검색 실행 함수
}

export default function SearchBar({
  searchOptions = [],
  autoCompleteData = [],
  onSearch,
}: SearchBarProps) {
  const [criteria, setCriteria] = useState(searchOptions[0].value);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(criteria, query);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        height: 40,
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
        options={autoCompleteData}
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
                py: 0, // ✅ 높이 균일화
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
