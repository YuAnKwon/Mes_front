
"use client";

import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { FaBoxArchive } from "react-icons/fa6";
import { HiChartPie, HiClipboardCheck, HiClipboardList, HiCube, HiShoppingBag } from "react-icons/hi";
import { HiMiniBuildingLibrary, HiOutlineArrowsUpDown } from "react-icons/hi2";
import { RiInboxArchiveFill, RiInboxArchiveLine, RiInboxUnarchiveFill, RiInboxUnarchiveLine } from "react-icons/ri";

export function SideNav() {
  return (
    <Sidebar
    className="h-screen bg-gray-900 text-white"
    aria-label="Sidebar with multi-level dropdown example"
    >
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiChartPie}>
            대시보드
          </SidebarItem>
          <SidebarCollapse icon={HiClipboardList} label="수주대상품목관리">
            <SidebarItem href="#" icon={RiInboxArchiveLine}>입고 등록</SidebarItem>
            <SidebarItem href="#" icon={RiInboxArchiveFill}>입고 조회</SidebarItem>
            <SidebarItem href="#" icon={RiInboxUnarchiveLine}>출고 등록</SidebarItem>
            <SidebarItem href="#" icon={RiInboxUnarchiveFill}>출고 조회</SidebarItem>
          </SidebarCollapse>
          <SidebarCollapse icon={HiCube} label="원자재 입출고 관리">
            <SidebarItem href="#" icon={RiInboxArchiveLine}>입고 등록</SidebarItem>
            <SidebarItem href="#" icon={RiInboxArchiveFill}>입고 조회</SidebarItem>
            <SidebarItem href="#" icon={RiInboxUnarchiveLine}>출고 등록</SidebarItem>
            <SidebarItem href="#" icon={RiInboxUnarchiveFill}>출고 조회</SidebarItem>
            <SidebarItem href="#" icon={FaBoxArchive}>재고 현황</SidebarItem>
          </SidebarCollapse>
          <SidebarCollapse icon={HiShoppingBag} label="기준 정보 관리">
            <SidebarItem href="#" icon={HiClipboardCheck}>수주대상품목</SidebarItem>
            <SidebarItem href="#" icon={HiCube}>원자재품목</SidebarItem>
            <SidebarItem href="#" icon={HiOutlineArrowsUpDown}>라우팅</SidebarItem>
            <SidebarItem href="#" icon={HiMiniBuildingLibrary}>업체</SidebarItem>
          </SidebarCollapse>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
