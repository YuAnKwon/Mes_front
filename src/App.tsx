import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListTable from "./order_item/ListTable";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/list" element={<ListTable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
