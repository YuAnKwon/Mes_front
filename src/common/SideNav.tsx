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
      aria-label="Sidebar with multi-level dropdown example "
      className="w-80"
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

      <SidebarItems>
        <SidebarItemGroup>
          {/* 현재 페이지이면 파랑 */}
          <SidebarCollapse
            icon={HiClipboardList}
            label="수주대상 입출고 관리"
            open
          >
            <SidebarItem
              href="/"
              icon={RiInboxArchiveLine}
              style={{ color: isActive("/") ? "blue" : "black" }}
            >
              입고 등록
            </SidebarItem>
            <SidebarItem
              href="/orderitem/inbound/list"
              icon={RiInboxArchiveFill}
              style={{
                color: isActive("/orderitem/inbound/list") ? "blue" : "black",
              }}
            >
              입고 조회
            </SidebarItem>
            <SidebarItem
              href="/orderitem/outbound/register"
              icon={RiInboxUnarchiveLine}
              style={{
                color: isActive("/orderitem/outbound/register")
                  ? "blue"
                  : "black",
              }}
            >
              출고 등록
            </SidebarItem>
            <SidebarItem
              href="/orderitem/outbound/list"
              icon={RiInboxUnarchiveFill}
              style={{
                color: isActive("/orderitem/outbound/list") ? "blue" : "black",
              }}
            >
              출고 조회
            </SidebarItem>
          </SidebarCollapse>
          <SidebarCollapse icon={HiCube} label="원자재 입출고 관리" open>
            <SidebarItem
              href="/material/inbound/register"
              icon={RiInboxArchiveLine}
              style={{
                color: isActive("/material/inbound/register")
                  ? "blue"
                  : "black",
              }}
            >
              입고 등록
            </SidebarItem>
            <SidebarItem
              href="/material/inbound/list"
              icon={RiInboxArchiveFill}
              style={{
                color: isActive("/material/inbound/list") ? "blue" : "black",
              }}
            >
              입고 조회
            </SidebarItem>
            <SidebarItem
              href="/material/outbound/register"
              icon={RiInboxUnarchiveLine}
              style={{
                color: isActive("/material/outbound/register")
                  ? "blue"
                  : "black",
              }}
            >
              출고 등록
            </SidebarItem>
            <SidebarItem
              href="/material/outbound/list"
              icon={RiInboxUnarchiveFill}
              style={{
                color: isActive("/material/outbound/list") ? "blue" : "black",
              }}
            >
              출고 조회
            </SidebarItem>
            <SidebarItem
              href="/material/totalstock"
              icon={FaBoxArchive}
              style={{
                color: isActive("/material/totalstock") ? "blue" : "black",
              }}
            >
              재고 현황
            </SidebarItem>
          </SidebarCollapse>
          <SidebarCollapse icon={HiShoppingBag} label="기준 정보 관리" open>
            <SidebarItem
              href="/master/orderitem/list"
              icon={HiClipboard}
              style={{
                color: isActive("/master/orderitem/list") ? "blue" : "black",
              }}
            >
              수주대상품목
            </SidebarItem>
            <SidebarItem
              href="/master/material/list"
              icon={HiCube}
              style={{
                color: isActive("/master/material/list") ? "blue" : "black",
              }}
            >
              원자재품목
            </SidebarItem>
            <SidebarItem
              href="/master/routing/list"
              icon={HiOutlineArrowsUpDown}
              style={{
                color: isActive("/master/routing/list") ? "blue" : "black",
              }}
            >
              라우팅
            </SidebarItem>
            <SidebarItem
              href="/master/company/list"
              icon={HiMiniBuildingLibrary}
              style={{
                color: isActive("/master/company/list") ? "blue" : "black",
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
