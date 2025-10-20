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
import type { MasterOrItList } from "../type";

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

  const [imgFiles, setImgFiles] = useState<File[]>([]); // 새로 올린 파일
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
    const newUrls = imgFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...(prev || []), ...newUrls]);

    return () => newUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [imgFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setImgFiles((prev) => [...prev, ...filesArray]);
  };

  const handleUpdate = async () => {
    if (!orderItem) return;

    const formData = new FormData();

    imgFiles.forEach((file) => formData.append("imgUrl", file));

    const { images, ...rest } = orderItem;
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        formData.append(key, value.toString());
    });

    try {
      await updateOrItDetail(orderItem.id, formData);
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
