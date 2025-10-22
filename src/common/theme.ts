import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6C5DD3", // 보라 톤
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
      main: "#42C38C",
    },
    background: {
      default: "#F8F9FA",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "'Noto Sans KR', sans-serif",
  },
});

export default theme;
