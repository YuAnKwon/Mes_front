module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}", // ✅ 이 줄이 중요!
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          600: "#000000", // Flowbite가 사용하는 hover 색상 덮어쓰기
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};