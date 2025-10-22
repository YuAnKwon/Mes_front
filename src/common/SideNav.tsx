"use client";

import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { FaBoxArchive } from "react-icons/fa6";
import {
  HiChartPie,
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

export function SideNav() {
  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example "
      className="w-80"
    >
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="/" icon={HiChartPie} style={{ color: "black" }}>
            대시보드
          </SidebarItem>
          <SidebarCollapse
            icon={HiClipboardList}
            label="수주대상 입출고 관리"
            open
          >
            <SidebarItem
              href="/"
              icon={RiInboxArchiveLine}
              style={{ color: "black" }}
            >
              입고 등록
            </SidebarItem>
            <SidebarItem
              href="/orderitem/inbound/list"
              icon={RiInboxArchiveFill}
              style={{ color: "black" }}
            >
              입고 조회
            </SidebarItem>
            <SidebarItem
              href="/orderitem/outbound/register"
              icon={RiInboxUnarchiveLine}
              style={{ color: "black" }}
            >
              출고 등록
            </SidebarItem>
            <SidebarItem
              href="/orderitem/outbound/list"
              icon={RiInboxUnarchiveFill}
              style={{ color: "black" }}
            >
              출고 조회
            </SidebarItem>
          </SidebarCollapse>
          <SidebarCollapse icon={HiCube} label="원자재 입출고 관리" open>
            <SidebarItem
              href="/material/inbound/register"
              icon={RiInboxArchiveLine}
              style={{ color: "black" }}
            >
              입고 등록
            </SidebarItem>
            <SidebarItem
              href="/material/inbound/list"
              icon={RiInboxArchiveFill}
              style={{ color: "black" }}
            >
              입고 조회
            </SidebarItem>
            <SidebarItem
              href="/material/outbound/register"
              icon={RiInboxUnarchiveLine}
              style={{ color: "black" }}
            >
              출고 등록
            </SidebarItem>
            <SidebarItem
              href="/material/outbound/list"
              icon={RiInboxUnarchiveFill}
              style={{ color: "black" }}
            >
              출고 조회
            </SidebarItem>
            <SidebarItem
              href="/material/totalstock"
              icon={FaBoxArchive}
              style={{ color: "black" }}
            >
              재고 현황
            </SidebarItem>
          </SidebarCollapse>
          <SidebarCollapse icon={HiShoppingBag} label="기준 정보 관리" open>
            <SidebarItem
              href="/master/orderitem/list"
              icon={HiClipboard}
              style={{ color: "black" }}
            >
              수주대상품목
            </SidebarItem>
            <SidebarItem
              href="/master/material/list"
              icon={HiCube}
              style={{ color: "black" }}
            >
              원자재품목
            </SidebarItem>
            <SidebarItem
              href="/master/routing/list"
              icon={HiOutlineArrowsUpDown}
              style={{ color: "black" }}
            >
              라우팅
            </SidebarItem>
            <SidebarItem
              href="/master/company/list"
              icon={HiMiniBuildingLibrary}
              style={{ color: "black" }}
            >
              업체
            </SidebarItem>
          </SidebarCollapse>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
