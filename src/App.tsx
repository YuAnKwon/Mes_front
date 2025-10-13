import "./App.css";
import { BrowserRouter, Routes } from "react-router-dom";
import { SideNav } from "./mater/SideNav";

function App() {
  return (
    <BrowserRouter>
    <SideNav/>
      <Routes>
        {/* <Route path="/board/show/:category" element={< >} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
