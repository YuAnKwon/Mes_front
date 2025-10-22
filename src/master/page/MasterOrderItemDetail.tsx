import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { Box, Checkbox, MenuItem, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Select } from "@mui/material";
import { getOrItDetail, updateOrItDetail } from "../api/OrderItemApi";
import { FiCamera } from "react-icons/fi";
import type { imgType, MasterOrItRegister, MasterRouting } from "../type";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";
import { getRoutingList } from "../api/RoutingApi";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface Props {
  itemId: number;
  onClose: (refresh?: boolean) => void; // refresh 옵션 추가
}

export default function MasterOrderItemDetail({ itemId, onClose }: Props) {
  const [imgFiles, setImgFiles] = useState<imgType[]>([]); // 새로 올린 파일
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // 전체 미리보기
  const [availableRoutings, setAvailableRoutings] = useState<MasterRouting[]>(
    []
  ); // 전체 공정
  const [selectedRoutings, setSelectedRoutings] = useState<MasterRouting[]>([]); // 선택된 공정

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
    routing: [],
  });

  // 1️⃣ 상세 데이터 로드
  const loadData = async () => {
    try {
      const response = await getOrItDetail(itemId);
      setOrderItem(response);

      if (response.images) {
        const sortedImages = response.images.sort((a, b) =>
          a.repYn === "Y" ? -1 : b.repYn === "Y" ? 1 : 0
        );

        const existingImgs: imgType[] = sortedImages.map((img) => ({
          id: img.id,
          imgUrl: img.imgUrl,
          repYn: img.repYn,
          file: undefined,
        }));

        setImgFiles(existingImgs);
        setPreviewUrls(existingImgs.map((img) => img.imgUrl));
      }
    } catch (error) {
      console.error("품목 불러오기 실패:", error);
    }
  };

  // 2️⃣ 공정 리스트 로드
  const loadRoutings = async () => {
    try {
      const list = await getRoutingList();
      setAvailableRoutings(list);
    } catch (error) {
      console.error("공정 리스트 불러오기 실패", error);
    }
  };

  // 3️⃣ 수정 처리
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      // JSON 데이터 + 이미지 메타
      const jsonData = JSON.stringify({
        ...orderItem,
        images: imgFiles.map((img, index) => ({
          id: img.id ?? null,
          repYn: index === 0 ? "Y" : "N",
          imgOriName: img.imgOriName,
        })),
        routing: selectedRoutings.map((r, idx) => ({
          routingId: r.id,
          routingOrder: idx + 1,
        })),
      });

      formData.append(
        "data",
        new Blob([jsonData], { type: "application/json" })
      );

      // 새 이미지만 첨부
      imgFiles.forEach(
        (img) => img.file && formData.append("imgUrl", img.file)
      );

      await updateOrItDetail(orderItem.id!, formData);

      alert("수정 완료!");
      onClose(true); // true 전달 → 테이블 갱신
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 실패");
    }
  };

  // 4️⃣ useEffect 통합
  useEffect(() => {
    loadData();
    loadRoutings();
  }, []);

  // availableRoutings와 orderItem.routing 모두 준비되면 selectedRoutings 세팅
  useEffect(() => {
    if (availableRoutings.length && orderItem.routing) {
      const initialSelectedRoutings: MasterRouting[] = orderItem.routing
        .map((r: any) => availableRoutings.find((ar) => ar.id === r.routingId))
        .filter((proc): proc is MasterRouting => !!proc) // proc가 MasterRouting임을 TS에게 알림
        .map((proc, idx) => ({
          ...proc,
          routingOrder: orderItem.routing[idx].routingOrder,
          id: proc.id!,
        }));
      setSelectedRoutings(initialSelectedRoutings);
    }
  }, [availableRoutings, orderItem.routing]);

  // ----------------------------
  // 이미지 미리보기 useEffect
  useEffect(() => {
    // ✅ 파일이 있으면 blob URL, 없으면 서버 URL 사용
    const urls = imgFiles.map((img) =>
      img.file ? URL.createObjectURL(img.file) : img.imgUrl
    );

    console.log("previewUrls 생성:", urls);
    setPreviewUrls(urls);

    // ✅ 메모리 누수 방지 - blob URL 정리
    return () => {
      urls.forEach((url, idx) => {
        if (imgFiles[idx]?.file) {
          URL.revokeObjectURL(url);
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

  const handleRoutingDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedRoutings);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedRoutings(items);
  };

  const handleCheck = (routing: MasterRouting, checked: boolean) => {
    if (checked) {
      setSelectedRoutings((prev) => [...prev, routing]);
    } else {
      setSelectedRoutings((prev) =>
        prev.filter((r) => r.processCode !== routing.processCode)
      );
    }
  };

  const columns: GridColDef[] = [
    {
      field: "check",
      headerName: "",
      width: 110,
      renderCell: (params) => {
        const checked = selectedRoutings.some(
          (r) => r.processCode === params.row.processCode
        );
        return (
          <Checkbox
            checked={checked}
            onChange={(e) => handleCheck(params.row, e.target.checked)}
          />
        );
      },
    },
    {
      field: "processCode",
      headerName: "공정코드",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "processName",
      headerName: "공정명",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "processTime",
      headerName: "공정시간(분)",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    { field: "remark", headerName: "비고", width: 300, headerAlign: "center" },
  ];

  return (
    <Box sx={{ p: 2, maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ width: "100%" }}>
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
                          style={{
                            left: "9rem",
                            top: "0.25rem",
                            backgroundColor: "transparent",
                            fontWeight: "bold",
                          }}
                          className="absolute w-6 h-6 flex items-center justify-center rounded-full text-black hover:bg-red-600 focus:outline-none transition"
                          title="이미지 삭제"
                        >
                          X
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

      <Box sx={{ mt: 4 }}>
        <Typography fontWeight="bold">공정 선택</Typography>

        {/* 전체 공정 DataGrid */}
        <Box sx={{ height: 350, mt: 2 }}>
          <DataGrid
            rows={availableRoutings.map((r) => ({ ...r, id: r.id }))}
            columns={columns}
            hideFooter
          />
        </Box>

        {/* 선택된 공정 드래그 */}
        <Box sx={{ mt: 4 }}>
          <Typography>선택된 공정 (드래그로 순서 조정)</Typography>
          {/* 헤더 */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "50px 50px 150px 200px 150px 250px",
              alignItems: "center",
              p: 1,
              mt: 1,
              mb: 1,
              border: "1px solid #ccc",
              borderRadius: 1,
              bgcolor: "#fff",
              // fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <span>선택</span>
            <span>순서</span>
            <span>공정코드</span>
            <span>공정명</span>
            <span>공정시간</span>
            <span>비고</span>
          </Box>
          <DragDropContext onDragEnd={handleRoutingDragEnd}>
            <Droppable droppableId="selected-routings">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {selectedRoutings.map((r, index) => (
                    <Draggable
                      key={r.processCode}
                      draggableId={r.processCode}
                      index={index}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "50px 50px 150px 200px 150px 250px",
                            alignItems: "center",
                            textAlign: "center",
                            p: 1,
                            mb: 1,
                            border: "1px solid #ccc",
                            borderRadius: 1,
                            bgcolor: "#fff",
                          }}
                        >
                          <Checkbox
                            checked
                            onChange={(e) => {
                              if (!e.target.checked) {
                                setSelectedRoutings((prev) =>
                                  prev.filter(
                                    (sel) => sel.processCode !== r.processCode
                                  )
                                );
                              }
                            }}
                          />
                          <span>{index + 1}</span>
                          <span>{r.processCode}</span>
                          <span>{r.processName}</span>
                          <span>{r.processTime}</span>
                          <span>{r.remark}</span>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>

        {/* 총 공정 시간 */}
        <Box sx={{ mt: 2 }}>
          총 공정 시간 :{" "}
          {Math.floor(
            selectedRoutings.reduce(
              (sum, r) => sum + Number(r.processTime),
              0
            ) / 60
          )}
          시간{" "}
          {selectedRoutings.reduce((sum, r) => sum + Number(r.processTime), 0) %
            60}
          분
        </Box>
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
