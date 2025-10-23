"use client";

import { Box } from "@mui/material";
import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { FaBoxArchive } from "react-icons/fa6";
import {
  HiClipboard,
  HiClipboardList,
  HiCube,
  HiShoppingBag,
} from "react-icons/hi";
import { HiMiniBuildingLibrary, HiOutlineArrowsUpDown } from "react-icons/hi2";
import {
  RiInboxArchiveFill,
  RiInboxArchiveLine,
  RiInboxUnarchiveFill,
  RiInboxUnarchiveLine,
} from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

export function SideNav() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 정보
  const pathname = location.pathname;
  const isActive = (href: string) => pathname === href; // 활성 상태 판단

  return (
    <Sidebar
      aria-label="Sidebar with custom transparent style"
      // ✅ Flowbite Sidebar의 테마 구조 (정확한 타입에 맞게 작성)
      theme={{
        root: {
          // Sidebar 최상위 컨테이너
          base: "h-screen w-80 bg-transparent text-black rounded-none shadow-none border-none overflow-hidden",
          // - h-full: 높이 100%
          // - w-80: 너비 80 (Tailwind 기준, 보통 320px)
          // - bg-transparent: 배경 투명
          // - text-white: 기본 텍스트 흰색
          // - rounded-none: 모서리 둥글기 제거
          // - shadow-none: 그림자 제거
          // - border-none: 테두리 제거

          inner: "h-screen overflow-hidden bg-transparent px-3 py-4 text-black",
          // Sidebar 내부 컨테이너 스타일
          // - overflow-y-auto: 세로 스크롤 자동
          // - overflow-x-hidden: 가로 스크롤 숨김
          // - px-3, py-4: padding
          // - bg-transparent: 배경 투명
          // - text-white: 텍스트 흰색
        },

        collapse: {
          // SidebarCollapse(접었다 펼치는 메뉴) 관련 스타일
          button:
            "flex items-center justify-between w-full p-2 text-black rounded-lg  bg-transparent",
          // - button 전체 영역 스타일
          // - flex, items-center, justify-between: 아이템 수평 정렬
          // - w-full: 버튼 너비 100%
          // - p-2: padding
          // - text-white: 텍스트 색상
          // - rounded-lg: 모서리 둥글기
          // - hover:bg-gray-700: 마우스 올리면 배경 회색

          icon: {
            base: "h-5 w-5 text-gray-400 transition-transform duration-200",
            // - Collapse 아이콘 기본 스타일
            // - h-5 w-5: 크기
            // - text-gray-400: 색상
            // - transition-transform duration-200: 회전 애니메이션

            open: { off: "", on: "rotate-180" },
            // - open 상태일 때 아이콘 회전
            // - off: 닫힘 상태
            // - on: 열림 상태 (180도 회전)
          },

          label: {
            // Collapse 라벨(텍스트) 관련
            base: "ml-3 flex-1 whitespace-nowrap text-left bg-transparent",
            // - ml-3: 왼쪽 마진
            // - flex-1: 가용 공간 채움
            // - whitespace-nowrap: 줄바꿈 방지
            // - text-left: 왼쪽 정렬

            title: "font-semibold",
            // - 라벨 텍스트 강조

            icon: {
              base: "h-5 w-5 text-gray-400",
              open: { off: "", on: "rotate-180" },
              // 라벨 아이콘 회전 효과
            },
          },

          list: "space-y-1 py-2 pl-4 text-black bg-transparent max-h-full overflow-hidden",
          // Collapse 펼쳤을 때 하위 메뉴 리스트 스타일
          // - space-y-1: 아이템 간 세로 간격
          // - py-2, pl-4: padding
          // - text-white: 텍스트 흰색
          // - bg-transparent: 배경 투명
        },

        itemGroup: {
          base: "space-y-1 bg-transparent text-black bg-transparent",
          // SidebarItemGroup(아이템 그룹) 기본 스타일
          // - space-y-1: 아이템 간 간격
          // - bg-transparent: 배경 투명
          // - text-white: 텍스트 흰색
        },

        item: {
          base: "flex items-center p-2 text-black rounded-lg  bg-transparent",
          // SidebarItem 기본 스타일
          // - flex, items-center: 수평 중앙 정렬
          // - p-2: padding
          // - text-white: 텍스트 흰색
          // - rounded-lg: 모서리 둥글기
          // - hover:bg-gray-700: 마우스 올리면 배경 회색

          active: "bg-gray-800 text-blue-400",
          // 활성화된 아이템 스타일
          // - bg-gray-800: 배경 어둡게
          // - text-blue-400: 텍스트 파랑
        },
      }}
    >
      {/* 로고 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // 수평 중앙
          alignItems: "center", // 수직 중앙 (필요시)
          // height: "100vh", // 전체 높이 예시
        }}
      >
        <Box
          component="img"
          sx={{
            width: 250,
            p: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
          alt="이미지 설명"
          src="/daewon.png"
        />
      </Box>

      <SidebarItems className="h-full overflow-hidden">
        <SidebarItemGroup>
          {/* 현재 페이지이면 파랑 */}
          <SidebarCollapse
            icon={HiClipboardList}
            label="수주대상 입출고 관리"
            style={{ backgroundColor: "transparent" }} // 강제 투명
            open
          >
            <SidebarItem
              href="/"
              icon={RiInboxArchiveLine}
              style={{ color: isActive("/") ? "#5477b0" : "black" }}
            >
              입고 등록
            </SidebarItem>
            <SidebarItem
              href="/orderitem/inbound/list"
              icon={RiInboxArchiveFill}
              style={{
                color: isActive("/orderitem/inbound/list")
                  ? "#5477b0"
                  : "black",
              }}
            >
              입고 조회
            </SidebarItem>
            <SidebarItem
              href="/orderitem/outbound/register"
              icon={RiInboxUnarchiveLine}
              style={{
                color: isActive("/orderitem/outbound/register")
                  ? "#5477b0"
                  : "black",
              }}
            >
              출고 등록
            </SidebarItem>
            <SidebarItem
              href="/orderitem/outbound/list"
              icon={RiInboxUnarchiveFill}
              style={{
                color: isActive("/orderitem/outbound/list")
                  ? "#5477b0"
                  : "black",
              }}
            >
              출고 조회
            </SidebarItem>
          </SidebarCollapse>
          <SidebarCollapse
            icon={HiCube}
            label="원자재 입출고 관리"
            style={{ backgroundColor: "transparent" }} // 강제 투명
            open
          >
            <SidebarItem
              href="/material/inbound/register"
              icon={RiInboxArchiveLine}
              style={{
                color: isActive("/material/inbound/register")
                  ? "#5477b0"
                  : "black",
              }}
            >
              입고 등록
            </SidebarItem>
            <SidebarItem
              href="/material/inbound/list"
              icon={RiInboxArchiveFill}
              style={{
                color: isActive("/material/inbound/list") ? "#5477b0" : "black",
              }}
            >
              입고 조회
            </SidebarItem>
            <SidebarItem
              href="/material/outbound/register"
              icon={RiInboxUnarchiveLine}
              style={{
                color: isActive("/material/outbound/register")
                  ? "#5477b0"
                  : "black",
              }}
            >
              출고 등록
            </SidebarItem>
            <SidebarItem
              href="/material/outbound/list"
              icon={RiInboxUnarchiveFill}
              style={{
                color: isActive("/material/outbound/list")
                  ? "#5477b0"
                  : "black",
              }}
            >
              출고 조회
            </SidebarItem>
            <SidebarItem
              href="/material/totalstock"
              icon={FaBoxArchive}
              style={{
                color: isActive("/material/totalstock") ? "#5477b0" : "black",
              }}
            >
              재고 현황
            </SidebarItem>
          </SidebarCollapse>
          <SidebarCollapse
            icon={HiShoppingBag}
            label="기준 정보 관리"
            style={{ backgroundColor: "transparent" }} // 강제 투명
            open
          >
            <SidebarItem
              href="/master/orderitem/list"
              icon={HiClipboard}
              style={{
                color: isActive("/master/orderitem/list") ? "#5477b0" : "black",
              }}
            >
              수주대상품목
            </SidebarItem>
            <SidebarItem
              href="/master/material/list"
              icon={HiCube}
              style={{
                color: isActive("/master/material/list") ? "#5477b0" : "black",
              }}
            >
              원자재품목
            </SidebarItem>
            <SidebarItem
              href="/master/routing/list"
              icon={HiOutlineArrowsUpDown}
              style={{
                color: isActive("/master/routing/list") ? "#5477b0" : "black",
              }}
            >
              라우팅
            </SidebarItem>
            <SidebarItem
              href="/master/company/list"
              icon={HiMiniBuildingLibrary}
              style={{
                color: isActive("/master/company/list") ? "#5477b0" : "black",
              }}
            >
              업체
            </SidebarItem>
          </SidebarCollapse>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
