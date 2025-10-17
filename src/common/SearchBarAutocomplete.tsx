import { Autocomplete, TextField } from "@mui/material";

interface AutocompleteProps {
  options: string[]; // 회사명 목록
  value: string; // 선택된 값
  onChange: (value: string) => void; // 선택 또는 입력 시 처리
}

export default function SearchBarAutocomplete({
  options,
  value,
  onChange,
}: AutocompleteProps) {
  return (
    <Autocomplete
      freeSolo
      options={options}
      value={value}
      onInputChange={(_, newValue) => onChange(newValue)}
      sx={{
        flex: 1,
        height: "100%",
        "& .MuiInputBase-root": {
          height: "100%",
          paddingRight: "40px !important",
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          placeholder="거래처명"
          sx={{
            "& .MuiInputBase-input": {
              py: 0,
              height: "100%",
              width: 300,
              "&:focus": {
                outline: "none",
                boxShadow: "none",
              },
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#999" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
          }}
          InputProps={{
            ...params.InputProps,
            sx: { height: "100%", p: 0 },
          }}
        />
      )}
    />
  );
}
