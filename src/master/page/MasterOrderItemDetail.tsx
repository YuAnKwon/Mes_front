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
import type { imgType, MasterOrItRegister } from "../type";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function MasterOrderItemDetail() {
  const [orderItem, setOrderItem] = useState<MasterOrItRegister>({
    itemCode: "",
    itemName: "",
    company: "",
    type: "",
    unitPrice: 0,
    color: "",
    coatingMethod: "",
    remark: "",
    imgUrl: [],
  });

  const [imgFiles, setImgFiles] = useState<imgType[]>([]); // 새로 올린 파일
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // 전체 미리보기

  const navigate = useNavigate();
  const { id } = useParams();

  //이미지파일 덮어쓰기를 위한 기존, 새 이미지 전송
  const handleUpdate = async () => {
    const formData = new FormData();

    // ✅ JSON 객체 구성 (기존 orderItem + 이미지 정보 포함)
    const jsonData = JSON.stringify({
      ...orderItem,
      images: imgFiles.map((img, index) => ({
        id: img.id ?? null, // 기존 이미지면 id 있음
        repYn: index === 0 ? "Y" : "N", // 첫 번째 이미지를 대표로 설정
      })),
    });

    // ✅ JSON을 Blob으로 감싸서 formData에 추가
    formData.append("data", new Blob([jsonData], { type: "application/json" }));

    // ✅ 새 이미지 파일만 formData에 추가 (기존 이미지는 file이 없음)
    if (imgFiles && imgFiles.length > 0) {
      imgFiles.forEach((img) => {
        if (img.file) formData.append("imgUrl", img.file);
      });
    }

    try {
      await updateOrItDetail(orderItem.id!, formData); // API 호출
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
            file: img.file,
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
          URL.revokeObjectURL(img.file as unknown as string); // img.file로 revoke
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

  // 이미지 삭제
  const handleRemoveImage = (index: number) => {
    setImgFiles((prev) => {
      const newImgs = prev.filter((_, i) => i !== index);

      // 대표 이미지(repYn) 재설정
      return newImgs.map((img, idx) => ({
        ...img,
        repYn: idx === 0 ? "Y" : "N",
      }));
    });
  };

  // 드래그앤드롭 완료 시
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return; // 드롭하지 않고 놓으면 무시

    const items = Array.from(imgFiles);
    const [removed] = items.splice(source.index, 1);
    items.splice(destination.index, 0, removed);

    // repYn 업데이트: 첫 번째를 대표 이미지로
    const updated = items.map((img, idx) => ({
      ...img,
      // 기존 ID 그대로 유지
      id: img.id,
      repYn: idx === 0 ? "Y" : "N",
    }));

    setImgFiles(updated);
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                className="flex items-start gap-4 flex-wrap mt-8"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {imgFiles.map((img, index) => (
                  <Draggable
                    key={img.id ?? index}
                    draggableId={String(img.id ?? index)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="relative w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {/* 대표 이미지 표시 */}
                        {img.repYn === "Y" && (
                          <div className="absolute top-0 left-0 bg-yellow-400 text-black text-xs px-1 py-0.5 z-10">
                            대표 이미지
                          </div>
                        )}

                        <img
                          src={
                            img.file
                              ? URL.createObjectURL(img.file)
                              : img.imgUrl
                          }
                          alt={`제품 사진 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-black/50 text-white text-sm hover:bg-red-600 transition"
                          title="이미지 삭제"
                        >
                          x
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

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
            )}
          </Droppable>
        </DragDropContext>
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
