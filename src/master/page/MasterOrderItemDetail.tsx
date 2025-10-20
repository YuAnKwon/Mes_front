import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { Box, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Select } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteImage,
  getOrItDetail,
  updateOrItDetail,
} from "../api/OrderItemApi";
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

  const handleUpdate = async () => {
    const formData = new FormData();

    // JSON 객체를 "data" key로 추가
    formData.append(
      "data",
      new Blob([JSON.stringify(orderItem)], { type: "application/json" })
    );

    // 파일 배열을 "imgUrl" key로 추가
    if (imgFiles && imgFiles.length > 0) {
      imgFiles.forEach((img) => {
        if (img.file) formData.append("imgUrl", img.file); // ✅ file만 append
      });
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

  // 상세 정보 가져오기
  useEffect(() => {
    const fetchOrderItemDetail = async () => {
      try {
        const response = await getOrItDetail(Number(id));
        setOrderItem(response);
        console.log("response :", response);

        if (response.images) {
          // 기존 이미지도 imgFiles에 추가
          const existingImgs: imgType[] = response.images.map((img: any) => ({
            id: img.id,
            imgUrl: img.imgUrl,
            repYn: img.repYn,
            // file은 기존 이미지라 undefined
          }));
          setImgFiles(existingImgs);

          // 미리보기용 URL
          const urls = existingImgs.map((img) => img.imgUrl);
          setPreviewUrls(urls);
        }
      } catch (error) {
        console.error("품목 불러오기 실패:", error);
      }
    };
    fetchOrderItemDetail();
  }, [id]);

  // ----------------------------
  // 이미지 미리보기 useEffect
  useEffect(() => {
    console.log("=== imgFiles 변경됨 ===");
    console.log("imgFiles:", imgFiles);

    const urls = imgFiles.map((img) =>
      img.file ? URL.createObjectURL(img.file) : img.imgUrl
    );
    console.log("previewUrls 생성:", urls);
    setPreviewUrls(urls);

    return () => {
      imgFiles.forEach((img) => {
        if (img.file) {
          console.log("revokeObjectURL:", img.imgUrl);
          URL.revokeObjectURL(img.imgUrl);
        }
      });
    };
  }, [imgFiles]);

  // ----------------------------
  // 파일 선택 시
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    console.log("선택된 파일들:", filesArray);

    const newImgs: imgType[] = filesArray.map((file, index) => ({
      id: undefined,
      imgUrl: URL.createObjectURL(file),
      repYn: "N",
      file,
    }));
    console.log("새 imgType 배열:", newImgs);

    setImgFiles((prev) => {
      const combined = [...prev, ...newImgs];
      console.log("결합된 imgFiles:", combined);
      return combined.map((img, idx) => ({
        ...img,
        repYn: idx === 0 ? "Y" : "N",
      }));
    });
  };

  // ----------------------------
  // 이미지 삭제
  const handleRemoveImage = async (index: number) => {
    console.log("삭제 요청 index:", index);
    const targetImg = imgFiles[index];
    console.log("삭제할 이미지:", targetImg);
    if (!targetImg) return;

    if (targetImg.id && !targetImg.file) {
      // 기존 이미지(DB) 삭제
      try {
        console.log("DB 이미지 삭제 API 호출:", targetImg.id);
        await deleteImage(targetImg.id); // API 호출
        alert("이미지 삭제 완료");
      } catch (error) {
        console.error("이미지 삭제 실패:", error);
        alert("이미지 삭제 실패");
        return;
      }
    }

    console.log("배열에서 제거 전 imgFiles:", imgFiles);
    setImgFiles((prev) => prev.filter((_, i) => i !== index));
    console.log("배열에서 제거 후 imgFiles:", imgFiles);
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
              className="relative w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={url}
                alt={`제품 사진 ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* 삭제 버튼 (오른쪽 상단 X) */}
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center
               rounded-full bg-black/60 text-white text-xs font-bold
               hover:bg-red-600 transition duration-200"
                title="이미지 삭제"
              >
                x
              </button>
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
