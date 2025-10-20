import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { Box, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Select } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getOrItDetail, updateOrItDetail } from "../api/OrderItemApi";
import { FiCamera } from "react-icons/fi";
import type { MasterOrItRegister } from "../type";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function MasterOrderItemDetail() {
  // const [company, setOrderItem] = useState("");
  const [company, setCompany] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [type, setType] = useState("");
  const [coatingMethod, setCoatingMethod] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [color, setColor] = useState("");
  const [remark, setRemark] = useState("");

  const [imgFiles, setImgFiles] = useState<File[]>([]); // 새로 올린 파일
  const [existingImages, setExistingImages] = useState<string[]>([]); // 기존 서버 이미지 URL
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // 전체 미리보기

  const navigate = useNavigate();
  const { id } = useParams();

  // 상세 정보 가져오기
  useEffect(() => {
    const fetchOrderItemDetail = async () => {
      try {
        const response = await getOrItDetail(id);
        // setOrderItem(response);//전체 dto 저장
        setCompany(response.company);
        setItemCode(response.itemCode);
        setItemName(response.itemName);
        setType(response.type);
        setCoatingMethod(response.coatingMethod);
        setUnitPrice(response.unitPrice);
        setColor(response.color);
        setRemark(response.remark);

        if (response.imgUrl) {
          const urls = response.imgUrl.map((p: any) => `${p.imgUrl}`);
          setExistingImages(urls);
        }
      } catch (error) {
        console.error("업체 정보 불러오기 실패:", error);
      }
    };
    fetchOrderItemDetail();
  }, [id]);

  // 미리보기 URL 생성
  useEffect(() => {
    const newUrls = imgFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...existingImages, ...newUrls]);

    return () => newUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [imgFiles, existingImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setImgFiles((prev) => [...prev, ...filesArray]);
  };

  const handleUpdate = async () => {
    const payload: MasterOrItRegister = {
      itemCode: itemCode,
      itemName,
      company,
      type,
      unitPrice: Number(unitPrice),
      color,
      coatingMethod,
      imgUrl: imgFiles, // 서버 전송용
      routing: [],
      remark,
    };

    try {
      // FormData 구성
      const formData = new FormData();
      if (payload.imgUrl) {
        payload.imgUrl.forEach((file) => formData.append("imgUrl", file));
      }

      // routing 배열은 필요 시 JSON 문자열로 전송
      if (payload.routing) {
        formData.append("routing", JSON.stringify(payload.routing));
      }

      // imgUrl과 routing을 제외한 나머지 속성만 FormData에 추가
      const rest = Object.fromEntries(
        Object.entries(payload).filter(
          ([key]) => key !== "imgUrl" && key !== "routing"
        )
      );

      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      await updateOrItDetail(id, formData);
      alert("수주대상품목 수정 완료!");
      navigate("/master/orderitem/list");
    } catch (error) {
      console.error("수주대상품목 수정 실패", error);
      alert("수정 실패");
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: "auto" }}>
      <h2>수주대상품목 수정</h2>

      <Box sx={{ height: 800, width: "100%" }}>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="company" required>
              거래처명
            </FormLabel>
            <OutlinedInput
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              size="small"
              required
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="itemCode" required>
              품목번호
            </FormLabel>
            <OutlinedInput
              id="itemCode"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              size="small"
              required
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="itemName" required>
              품목명
            </FormLabel>
            <OutlinedInput
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              size="small"
              required
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="type" required>
              분류
            </FormLabel>
            <Select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              size="small"
              required
              fullWidth
            >
              <MenuItem value="" disabled>
                원자재 종류 선택
              </MenuItem>
              <MenuItem value="GENERAL">일반</MenuItem>
              <MenuItem value="CAR">자동차</MenuItem>
              <MenuItem value="SHIPBUILDING">조선</MenuItem>
              <MenuItem value="DEFENSE">방산</MenuItem>
            </Select>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="coatingMethod" required>
              도장 방식
            </FormLabel>
            <Select
              id="coatingMethod"
              value={coatingMethod}
              onChange={(e) => setCoatingMethod(e.target.value)}
              size="small"
              required
              fullWidth
            >
              <MenuItem value="" disabled>
                도장 방식 선택
              </MenuItem>
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
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              size="small"
              required
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="color" required>
              색상
            </FormLabel>
            <OutlinedInput
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              size="small"
              required
            />
          </FormGrid>

          <FormGrid size={{ xs: 12 }}>
            <FormLabel htmlFor="remark">비고</FormLabel>
            <OutlinedInput
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              size="small"
            />
          </FormGrid>
        </Grid>

        {/* 이미지 업로드 */}
        <div className="flex items-start gap-4 flex-wrap mt-8">
          {previewUrls.map((url, idx) => (
            <div
              key={idx}
              className="w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={url}
                alt={`제품 사진 ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <FiCamera size={32} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">사진 업로드</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ height: 40, fontWeight: 500, px: 2.5 }}
          onClick={handleUpdate}
        >
          수정
        </Button>
      </Box>
    </Box>
  );
}
