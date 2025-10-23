import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#466ba6", // 등록 버튼
    },
    secondary: {
      main: "#FF6B6B", // 핑크 레드 톤
    },
    error: {
      main: "#FF4C4C",
    },
    warning: {
      main: "#FFA94D",
    },
    info: {
      main: "#4D96FF",
    },
    success: {
      main: "#46a66f", //엑셀쪽 버튼
    },
    background: {
      default: "#f0f4fa", //배경색
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        row: {
          "&:hover": {
            backgroundColor: "#f0f4fa",
          },
        },
      },
    },
  },
});

export default theme;
