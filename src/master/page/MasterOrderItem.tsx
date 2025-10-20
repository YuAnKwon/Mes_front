import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { MasterOrItRegister } from "../type";
import { registerOrderItem } from "../api/OrderItemApi";
import { FiCamera } from "react-icons/fi";
import { getSupplierList } from "../api/companyApi";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function MasterOrderItem() {
  const [company, setCompany] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [type, setType] = useState("");
  const [coatingMethod, setCoatingMethod] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [color, setColor] = useState("");
  const [remark, setRemark] = useState("");
  const [companyList, setCompanyList] = useState<string[]>([]);

  // 거래처 리스트 불러오기
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getSupplierList();
        const names = res.map((item: any) => item.companyName);
        setCompanyList(names);
      } catch (error) {
        console.error("거래처 목록 불러오기 실패:", error);
      }
    };
    fetchCompanies();
  }, []);

  const navigate = useNavigate();

  const handleSave = async () => {
    const payload: MasterOrItRegister = {
      itemCode: itemCode,
      itemName,
      company,
      type,
      unitPrice: Number(unitPrice),
      color,
      coatingMethod,
      imgUrl: [],
      routing: [],
      remark,
    };

    try {
      await registerOrderItem(payload);
      alert("수주대상품목 등록 완료!");
      navigate("/master/orderitem/list");
    } catch (error) {
      console.error("수주대상품목 등록 실패", error);
      alert("등록 실패");
    }
  };

  const [orderInfo, setOrderInfo] = useState<{
    photos: string[]; // 미리보기용
    imgUrl: File[]; // 서버 전송용
  }>({
    photos: [],
    imgUrl: [],
  });

  //이미지 영역
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);

      // 미리보기용 처리
      const fileReaders: Promise<string>[] = fileArray.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      );

      Promise.all(fileReaders).then((images) => {
        setOrderInfo((prev) => ({
          photos: [...prev.photos, ...images],
          imgUrl: [...prev.imgUrl, ...fileArray],
        }));
      });
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: "auto" }}>
      <h2>수주대상등록 등록</h2>

      <Box sx={{ height: 600, width: "100%" }}>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="company" required>
              거래처명
            </FormLabel>
            <Autocomplete
              freeSolo
              options={companyList}
              value={company}
              onChange={(e, newValue) => setCompany(newValue || "")}
              onInputChange={(e, newInputValue) => setCompany(newInputValue)}
              ListboxProps={{
                style: {
                  maxHeight: 200, // 스크롤 생김
                  overflowY: "auto",
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="거래처명"
                  size="small"
                  required
                />
              )}
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }} />
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="itemCode" required>
              품목번호
            </FormLabel>
            <OutlinedInput
              id="itemCode"
              name="itemCode"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              type="text"
              placeholder="품목번호"
              autoComplete="on"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="itemName" required>
              품목명
            </FormLabel>
            <OutlinedInput
              id="itemName"
              name="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              type="text"
              placeholder="품목명"
              autoComplete="on"
              required
              size="small"
            />
          </FormGrid>

          {/* 분류 */}
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="type" required>
              분류
            </FormLabel>
            <Select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              input={<OutlinedInput />}
              size="small"
              required
              fullWidth
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#aaa" }}>분류 선택</span>;
                }
                return (
                  {
                    GENERAL: "일반",
                    CAR: "자동차",
                    SHIPBUILDING: "조선",
                    DEFENSE: "방산",
                  }[selected] || selected
                );
              }}
            >
              <MenuItem value="GENERAL">일반</MenuItem>
              <MenuItem value="CAR">자동차</MenuItem>
              <MenuItem value="SHIPBUILDING">조선</MenuItem>
              <MenuItem value="DEFENSE">방산</MenuItem>
            </Select>
          </FormGrid>

          {/* 도장 방식 */}
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="coatingMethod" required>
              도장 방식
            </FormLabel>
            <Select
              id="coatingMethod"
              name="coatingMethod"
              value={coatingMethod}
              onChange={(e) => setCoatingMethod(e.target.value)}
              input={<OutlinedInput />}
              size="small"
              required
              fullWidth
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#aaa" }}>도장 방식 선택</span>;
                }
                return (
                  {
                    POWDER: "분체",
                    LIQUID: "액체",
                  }[selected] || selected
                );
              }}
            >
              <MenuItem value="POWDER">분체</MenuItem>
              <MenuItem value="LIQUID">액체</MenuItem>
            </Select>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="unitPrice" required>
              품목단가
            </FormLabel>
            <OutlinedInput
              id="unitPrice"
              name="unitPrice"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              type="text"
              placeholder="품목단가"
              autoComplete="on"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="color" required>
              색상
            </FormLabel>
            <OutlinedInput
              id="color"
              name="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              type="text"
              placeholder="색상"
              autoComplete="on"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12 }}>
            <FormLabel htmlFor="remark">비고</FormLabel>
            <OutlinedInput
              id="remark"
              name="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              type="text"
              placeholder="비고"
              autoComplete="off"
              size="small"
            />
          </FormGrid>
        </Grid>
        <div className="flex items-start gap-4 flex-wrap mt-8">
          {orderInfo.photos.map((photo, idx) => (
            <div
              key={idx}
              className="w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={photo}
                alt={`제품 사진 ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* 업로드 버튼 */}
          <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <FiCamera size={32} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">사진 업로드</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>
      </Box>

      {/* 버튼 영역 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* 버튼 영역 */}
        <Box sx={{ ml: "auto" }}>
          <Button
            variant="outlined"
            color="primary"
            sx={{ height: 40, fontWeight: 500, px: 2.5 }}
            onClick={handleSave}
          >
            수주대상품목 등록
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
