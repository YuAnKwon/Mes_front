import * as XLSX from "xlsx-js-style";

export const createStyledWorksheet = (excelData: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // ✅ 1️⃣ 타입 기반 열 너비 계산
  const keys = Object.keys(excelData[0]);

  const colWidths = keys.map((key) => {
    // 기본 너비: 타입에 따라 다르게 지정
    const sampleValue = excelData.find((row) => row[key] !== undefined)?.[key];
    let baseWidth = 15; // 기본값

    if (typeof sampleValue === "number") baseWidth = 12;
    else if (typeof sampleValue === "string") {
      // YYYY-MM-DD 같은 날짜형 문자열인지 체크
      if (/^\d{4}-\d{2}-\d{2}/.test(sampleValue)) baseWidth = 12;
      else baseWidth = 15;
    }

    // 내용 중 가장 긴 길이 측정
    const maxLength = Math.max(
      key.length,
      ...excelData.map((row) => (row[key] ? row[key].toString().length : 0))
    );

    // 기본 너비와 내용 길이 중 더 큰 쪽 선택
    const finalWidth = Math.max(baseWidth, maxLength + 2);

    return { wch: finalWidth };
  });

  worksheet["!cols"] = colWidths;

  // ✅ 2️⃣ 스타일 적용 (가운데 정렬 + 테두리 + 헤더 회색)
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (!cell) continue;

      // 기본 스타일
      cell.s = {
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };

      // 헤더 스타일
      if (R === 0) {
        cell.s.fill = {
          patternType: "solid",
          fgColor: { rgb: "D9D9D9" },
        };
        cell.s.font = { bold: true, color: { rgb: "000000" } };
      }
    }
  }

  return worksheet;
};
