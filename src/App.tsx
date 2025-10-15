import "./tailwind.css";
// import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SideNav } from "./common/SideNav";
import OrderInboundRegister from "./orderitem/page/OrderInboundRegister";
import { MaterialInboundregister } from "./material/page/MaterialInboundregister";
import { MaterialInboundList } from "./material/page/MaterialInboundList";
import OrderInboundList from "./orderitem/page/OrderInboundList";
import OrderOutboundRegister from "./orderitem/page/OrderOutboundRegister";
import MasterOrderItemList from "./master/page/MasterOrderItemList";
import MasterCompanyList from "./master/page/MasterCompanyList";
import MasterCompany from "./master/page/MasterCompany";
import OrderOutboundList from "./orderitem/page/OrderOutboundList";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        {/* 사이드바 (왼쪽 고정) */}
        <div className="w-64">
          <SideNav />
        </div>

        {/* 본문 (오른쪽 영역) */}
        <div className="flex-1 p-6  ">
          <Routes>
            {/* 수주대상품목 */}
            <Route path="/" element={<OrderInboundRegister />} />
            <Route
              path="/orderitem/inbound/list"
              element={<OrderInboundList />}
            />
            <Route
              path="/orderitem/outbound/register"
              element={<OrderOutboundRegister />}
            />
            <Route
              path="/orderitem/outbound/list"
              element={<OrderOutboundList />}
            />

            {/* 원자재 */}
            <Route
              path="/material/inbound/register"
              element={<MaterialInboundregister />}
            />
            <Route
              path="/material/inbound/list"
              element={<MaterialInboundList />}
            />
            {/* <Route path="/material/outbound/register" element={<MaterialOutboundRegister />} />
            <Route path="/material/outbound/list" element={<MaterialOutboundList />} />  */}

            {/* 기준정보관리 */}
            <Route
              path="/master/orderitem/list"
              element={<MasterOrderItemList />}
            />
            <Route
              path="/master/company/list"
              element={<MasterCompanyList />}
            />
            <Route
              path="/master/company/register"
              element={<MasterCompany />}
            />
            {/* <Route path="/master/orderitem" element={<MasterOrderItem />} />
            <Route path="/master/material" element={<MasterMaterial />} />
            <Route path="/master/routing" element={<MasterRouting />} />
            <Route path="/master/company" element={<MasterCompany />} />  */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
