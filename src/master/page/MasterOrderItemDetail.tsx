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
import type { imgType, MasterOrItList } from "../type";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function MasterOrderItemDetail() {
  const [orderItem, setOrderItem] = useState<MasterOrItList>({
    itemCode: "",
    itemName: "",
    company: "",
    type: "",
    unitPrice: 0,
    color: "",
    coatingMethod: "",
    remark: "",
    useYn: "",
    imgUrl: [],
  });

  const [imgFiles, setImgFiles] = useState<imgType[]>([]); // 새로 올린 파일
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // 전체 미리보기

  const navigate = useNavigate();
  const { id } = useParams();

  // 상세 정보 가져오기
  useEffect(() => {
    const fetchOrderItemDetail = async () => {
      try {
        const response = await getOrItDetail(Number(id));
        setOrderItem(response);
        console.log("response :", response);

        if (response.images) {
          const urls = response.images.map((p: any) => p.imgUrl);
          setPreviewUrls(urls);
        }
      } catch (error) {
        console.error("품목 불러오기 실패:", error);
      }
    };
    fetchOrderItemDetail();
  }, [id]);

  // 이미지 미리보기
  useEffect(() => {
    if (!imgFiles || imgFiles.length === 0) return;

    // 새로 추가된 이미지 파일만 Blob URL 생성
    const newBlobUrls = imgFiles
      .filter((img) => img.file) // 새로 추가된 파일만
      .map((img) => URL.createObjectURL(img.file!));

    // 기존 이미지 URL + 새 Blob URL 합치기
    setPreviewUrls((prev) => {
      // 중복 방지: 이미 포함된 URL은 제외
      const all = [...prev, ...newBlobUrls];
      return Array.from(new Set(all));
    });

    // cleanup: 새로 생성된 Blob URL만 해제
    return () => {
      newBlobUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imgFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    // 새로 업로드된 이미지 배열 생성
    const newImgs: imgType[] = filesArray.map((file, index) => ({
      id: Date.now() + index, // 임시 id
      imgUrl: URL.createObjectURL(file),
      repYn: "N", // 일단 모두 N으로
      file, // 실제 업로드할 File 객체 포함
    }));

    setImgFiles((prev) => {
      const combined = [...prev, ...newImgs];
      // 맨 앞 이미지 대표로 설정
      return combined.map((img, idx) => ({
        ...img,
        repYn: idx === 0 ? "Y" : "N",
      }));
    });
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    // JSON 객체를 "data" key로 추가
    formData.append(
      "data",
      new Blob([JSON.stringify(orderItem)], { type: "application/json" })
    );

    // 파일 배열을 "imgUrl" key로 추가
    if (imgFiles && imgFiles.length > 0) {
      imgFiles.forEach((file) => formData.append("imgUrl", file));
    }

    try {
      await updateOrItDetail(orderItem.id, formData); // api 함수 호출
      alert("수정 완료!");
      navigate("/master/orderitem/list");
    } catch (error) {
      console.error("수정 실패:", error);
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
              value={orderItem.company}
              onChange={(e) =>
                setOrderItem({ ...orderItem, company: e.target.value })
              }
              size="small"
              required
            />
          </FormGrid>
          <Grid container spacing={3} sx={{ mt: 4 }} />
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="itemCode" required>
              품목번호
            </FormLabel>
            <OutlinedInput
              id="itemCode"
              value={orderItem.itemCode}
              onChange={(e) =>
                setOrderItem({ ...orderItem, itemCode: e.target.value })
              }
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
              value={orderItem.itemName}
              onChange={(e) =>
                setOrderItem({ ...orderItem, itemName: e.target.value })
              }
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
              value={orderItem.type}
              onChange={(e) =>
                setOrderItem({ ...orderItem, type: e.target.value })
              }
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
              value={orderItem.coatingMethod}
              onChange={(e) =>
                setOrderItem({ ...orderItem, coatingMethod: e.target.value })
              }
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
              value={orderItem.unitPrice}
              onChange={(e) =>
                setOrderItem({
                  ...orderItem,
                  unitPrice: Number(e.target.value),
                })
              }
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
              value={orderItem.color}
              onChange={(e) =>
                setOrderItem({ ...orderItem, color: e.target.value })
              }
              size="small"
              required
            />
          </FormGrid>

          <FormGrid size={{ xs: 12 }}>
            <FormLabel htmlFor="remark">비고</FormLabel>
            <OutlinedInput
              id="remark"
              value={orderItem.remark}
              onChange={(e) =>
                setOrderItem({ ...orderItem, remark: e.target.value })
              }
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
