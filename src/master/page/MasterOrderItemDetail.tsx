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
import type { MasterOrItRegister, Photo } from "../type";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function MasterOrderItemDetail() {
  const [company, setCompany] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [type, setType] = useState("");
  const [coatingMethod, setCoatingMethod] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [color, setColor] = useState("");
  const [remark, setRemark] = useState("");

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchOrderItemDetail = async () => {
      try {
        const response = await getOrItDetail(id); // ← API 호출

        // 상태에 기존 값 채워 넣기
        setCompany(response.company);
        setItemCode(response.itemCode);
        setItemName(response.itemName);
        setType(response.type);
        setCoatingMethod(response.coatingMethod);
        setUnitPrice(response.unitPrice);
        setColor(response.color);
        setRemark(response.remark);
      } catch (error) {
        console.error("업체 정보 불러오기 실패:", error);
      }
    };

    fetchOrderItemDetail();
  }, [id]);

  const handleUpdate = async () => {
    const payload: MasterOrItRegister = {
      itemCode: Number(itemCode),
      itemName,
      company,
      type,
      unitPrice: Number(unitPrice),
      color,
      coatingMethod,
      imgUrl: imgFiles,
      routing: [],
      remark,
    };

    try {
      await updateOrItDetail(id, payload);
      alert("수주대상품목 수정 완료!");
      navigate("/master/orderitem/list");
    } catch (error) {
      console.error("수주대상품목 수정 실패", error);
      alert("수정 실패");
    }
  };

  const [imgFiles, setImgFiles] = useState<File[]>([]);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
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

        //밑에 있는애 전 버전, photo타입 설정 전
        // Promise.all(fileReaders).then((images) => {
        //   setOrderInfo((prev) => ({
        //     photos: [...prev.photos, ...images],
        //     imgUrl: [...prev.imgUrl, ...fileArray],
        //   }));
        // });
        Promise.all(fileReaders).then((images) => {
          const newPhotos = images.map((src, i) => ({
            orderItem: null,
            imgOriName: fileArray[i].name,
            imgFileName: fileArray[i].name,
            imgUrl: src, // base64로 미리보기
            repYn: "N",
          }));

          setOrderInfo((prev) => ({
            photos: [...prev.photos, ...newPhotos],
            imgUrl: [...prev.imgUrl, ...fileArray],
          }));
        });
      }
      setImgFiles(Array.from(e.target.files));
    }
  };

  const [orderInfo, setOrderInfo] = useState<{
    photos: Photo[]; // 미리보기용
    imgUrl: File[]; // 서버 전송용
  }>({
    photos: [],
    imgUrl: [],
  });

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
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              type="text"
              placeholder="거래처명"
              autoComplete="organization"
              required
              size="small"
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

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="type" required>
              분류
            </FormLabel>
            <Select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              displayEmpty
              input={<OutlinedInput />}
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
              name="coatingMethod"
              value={coatingMethod}
              onChange={(e) => setCoatingMethod(e.target.value)}
              displayEmpty
              input={<OutlinedInput />}
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
                // src={photo}
                src={`/api${photo.imgUrl}`} // 여기서 imgUrl 사용, 필요하면 /api 붙이기
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
              onChange={handleFileChange}
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
            onClick={handleUpdate}
          >
            수정
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
