import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListTable from "./order_item/ListTable";
import { SideNav } from "./mater/SideNav";

function App() {
  return (
    <BrowserRouter>
      <SideNav />
      <Routes>
        <Route path="/list" element={<ListTable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
