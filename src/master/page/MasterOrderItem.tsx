import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  FormLabel,
  OutlinedInput,
  MenuItem,
  Select,
  Button,
  Checkbox,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Autocomplete, TextField } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";
import type { imgType, MasterRouting } from "../type";
import { registerOrderItem } from "../api/OrderItemApi";
import { FiCamera } from "react-icons/fi";
import { getClientList } from "../api/companyApi";
import { getRoutingList } from "../api/RoutingApi";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface MasterOrderItemProps {
  onRegisterComplete?: () => void;
}

export default function MasterOrderItem({
  onRegisterComplete,
}: MasterOrderItemProps) {
  const [company, setCompany] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [type, setType] = useState("");
  const [coatingMethod, setCoatingMethod] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [color, setColor] = useState("");
  const [remark, setRemark] = useState("");
  const [companyList, setCompanyList] = useState<string[]>([]);

  //서버에서 가져온 전체 공정 리스트
  const [availableRoutings, setAvailableRoutings] = useState<MasterRouting[]>(
    []
  );
  //사용자가 선택한 공정 목록,
  const [selectedRoutings, setSelectedRoutings] = useState<MasterRouting[]>([]);

  const [imgFiles, setImgFiles] = useState<imgType[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // 미리보기용
  const [unitPriceError, setUnitPriceError] = useState(false);

  // 거래처 리스트 불러오기
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getClientList();
        const names = res.map((item: any) => item.companyName);
        setCompanyList(names);
      } catch (error) {
        console.error("거래처 목록 불러오기 실패:", error);
      }
    };
    fetchCompanies();
  }, []);

  // ----------------------------
  // 파일 선택 시
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    const newImgs: imgType[] = filesArray.map((file) => ({
      id: undefined,
      imgUrl: URL.createObjectURL(file),
      repYn: "N",
      file,
    }));

    setImgFiles((prev) => {
      const combined = [...prev, ...newImgs];
      return combined.map((img, idx) => ({
        ...img,
        repYn: idx === 0 ? "Y" : "N", // 첫 번째 이미지를 대표로
      }));
    });
  };

  // ----------------------------
  // 이미지 삭제
  const handleRemoveImage = (index: number) => {
    const updated = imgFiles.filter((_, i) => i !== index);
    const reflagged = updated.map((img, idx) => ({
      ...img,
      repYn: idx === 0 ? "Y" : "N",
    }));
    setImgFiles(reflagged);
  };

  // 이미지 드래그용
  const handleImageDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = Array.from(imgFiles);
    const [removed] = items.splice(source.index, 1);
    items.splice(destination.index, 0, removed);

    const updated = items.map((img, idx) => ({
      ...img,
      repYn: idx === 0 ? "Y" : "N",
    }));

    setImgFiles(updated);
  };
  // ----------------------------
  // 이미지 미리보기 갱신
  useEffect(() => {
    const urls = imgFiles.map((img) =>
      img.file ? URL.createObjectURL(img.file) : img.imgUrl
    );
    setPreviewUrls(urls);

    return () => {
      imgFiles.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.imgUrl);
      });
    };
  }, [imgFiles]);

  // 공정 리스트 가져오기
  useEffect(() => {
    const fetchRoutings = async () => {
      try {
        const list = await getRoutingList();
        setAvailableRoutings(list);
      } catch (error) {
        console.error("공정 리스트 불러오기 실패", error);
      }
    };
    fetchRoutings();
  }, []);

  // 공정 드래그용
  const handleRoutingDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedRoutings);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedRoutings(items);
  };

  // 체크박스 클릭 시
  const handleCheck = (routing: MasterRouting, checked: boolean) => {
    if (checked) {
      setSelectedRoutings((prev) => [...prev, routing]);
    } else {
      setSelectedRoutings((prev) =>
        prev.filter((r) => r.processCode !== routing.processCode)
      );
    }
  };

  const handleSave = async () => {
    const missingFields = [];

    if (!company) missingFields.push("거래처명");
    if (!itemCode) missingFields.push("품목번호");
    if (!itemName) missingFields.push("품목명");
    if (!type) missingFields.push("분류");
    if (!coatingMethod) missingFields.push("도장 방식");
    if (!unitPrice) missingFields.push("품목단가");
    if (!color) missingFields.push("색상");
    if (selectedRoutings.length === 0) missingFields.push("공정");

    if (missingFields.length > 0) {
      alert(`${missingFields.join(", ")} 입력해주세요.`);
      return;
    }

    // FormData 생성
    const formData = new FormData();

    // JSON 데이터
    const json = JSON.stringify({
      itemCode,
      itemName,
      company,
      type,
      unitPrice: Number(unitPrice),
      color,
      coatingMethod,
      routing: selectedRoutings.map((r, index) => ({
        routingId: r.id,
        routingOrder: index + 1,
      })),
      remark,
    });
    formData.append("data", new Blob([json], { type: "application/json" }));

    // 실제 File 객체만 append
    imgFiles.forEach((img) => {
      if (img.file) {
        formData.append("imgUrl", img.file);
      }
    });

    try {
      console.log("등록한 formdata", formData.get);
      await registerOrderItem(formData); // 이제 formData 전달
      console.log("등록 완료!", formData);
      alert("수주대상품목 등록 완료!");
      onRegisterComplete?.();
    } catch (error) {
      if (error.response?.data?.message?.includes("이미 존재하는 품목번호")) {
        alert("이미 존재하는 품목번호입니다.");
      } else {
        console.error("등록 실패", error);
        alert("등록 실패");
      }
    }
  };

  const totalMinutes = selectedRoutings.reduce(
    (sum, r) => sum + Number(r.processTime),
    0
  );

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
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    {
      field: "processName",
      headerName: "공정명",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "processTime",
      headerName: "공정시간(분)",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    { field: "remark", headerName: "비고", width: 300, headerAlign: "center" },
  ];

  return (
    <Box sx={{ p: 2, maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {/* 거래처명 */}
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
              renderInput={(params) => {
                // 리스트에 없는 값이면 에러 표시
                const isError =
                  company.trim() !== "" && !companyList.includes(company);

                return (
                  <TextField
                    {...params}
                    placeholder="거래처명"
                    size="small"
                    required
                    error={isError}
                    helperText={
                      isError ? "등록된 거래처만 선택 가능합니다." : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: isError ? "red" : undefined,
                        },
                        "&:hover fieldset": {
                          borderColor: isError ? "red" : undefined,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: isError ? "red" : undefined,
                        },
                      },
                    }}
                  />
                );
              }}
              ListboxProps={{
                style: { maxHeight: 200, overflowY: "auto" },
              }}
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }} />
          {/* 품목번호 */}
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="itemCode" required>
              품목번호
            </FormLabel>
            <OutlinedInput
              id="itemCode"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              placeholder="품목번호"
              size="small"
              required
            />
          </FormGrid>

          {/* 품목명 */}
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="itemName" required>
              품목명
            </FormLabel>
            <OutlinedInput
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="품목명"
              size="small"
              required
            />
          </FormGrid>

          {/* 분류 */}
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="type" required>
              분류
            </FormLabel>
            <Select
              id="type"
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

          {/* 단가, 색상, 비고 */}
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="unitPrice" required>
              품목단가
            </FormLabel>
            <OutlinedInput
              id="unitPrice"
              value={unitPrice}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setUnitPrice(value);
                  setUnitPriceError(false);
                } else {
                  setUnitPriceError(true);
                }
              }}
              placeholder="품목단가"
              size="small"
              required
            />
            {unitPriceError && (
              <Typography variant="caption" color="error">
                숫자만 입력해주세요.
              </Typography>
            )}
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="color" required>
              색상
            </FormLabel>
            <OutlinedInput
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="색상"
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
              placeholder="비고"
              size="small"
            />
          </FormGrid>
        </Grid>
        <DragDropContext onDragEnd={handleImageDragEnd}>
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

      {/* 공정 선택 및 드래그 테이블 */}
      <Box sx={{ mt: 4 }}>
        <Typography fontWeight="bold">공정 선택</Typography>
        <Box sx={{ width: "100%", mt: 2 }}>
          {/* 전체 DataGrid */}
          <Box sx={{ height: 350 }}>
            <DataGrid
              rows={availableRoutings.map((r) => ({ ...r, id: r.id }))}
              columns={columns}
              hideFooter
            />
          </Box>

          {/* 선택된 공정 (드래그 가능) */}
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
                        {(provided, snapshot) => (
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
          {/* 선택된 공정 리스트 아래 */}
          <Box sx={{ mt: 2 }}>
            총 공정 시간 : {Math.floor(totalMinutes / 60)}시간{" "}
            {totalMinutes % 60}분 ({totalMinutes}분)
          </Box>
        </Box>
      </Box>

      {/* 저장 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ height: 40, fontWeight: 500, px: 2.5 }}
          onClick={handleSave}
        >
          저장
        </Button>
      </Box>
    </Box>
  );
}
