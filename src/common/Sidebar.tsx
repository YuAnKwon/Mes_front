// src/components/Sidebar.tsx
import { useState } from "react";
import "../assets/css/style.css";

export default function Sidebar() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [pageOpen, setPageOpen] = useState(false);

  return (
    <div
      className={`wrapper d-flex align-items-stretch ${
        sidebarActive ? "active" : ""
      }`}
    >
      {/* 사이드바 */}
      <nav id="sidebar">
        <div className="custom-menu">
          <button
            type="button"
            id="sidebarCollapse"
            className="btn btn-primary"
            onClick={() => setSidebarActive(!sidebarActive)}
          >
            <i className="fa fa-bars"></i>
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>

        <div className="p-4 pt-5">
          <h1>
            <a href="/" className="logo">
              MES
            </a>
          </h1>

          <ul className="list-unstyled components mb-5">
            {/* Home 메뉴 */}
            <li className={homeOpen ? "active" : ""}>
              <a
                href="#homeSubmenu"
                className="dropdown-toggle"
                onClick={(e) => {
                  e.preventDefault();
                  setHomeOpen(!homeOpen);
                }}
              >
                Home
              </a>
              <ul
                className={`list-unstyled collapse ${homeOpen ? "show" : ""}`}
                id="homeSubmenu"
              >
                <li>
                  <a href="#">Home 1</a>
                </li>
                <li>
                  <a href="#">Home 2</a>
                </li>
                <li>
                  <a href="#">Home 3</a>
                </li>
              </ul>
            </li>

            <li>
              <a href="#">About</a>
            </li>

            {/* Pages 메뉴 */}
            <li className={pageOpen ? "active" : ""}>
              <a
                href="#pageSubmenu"
                className="dropdown-toggle"
                onClick={(e) => {
                  e.preventDefault();
                  setPageOpen(!pageOpen);
                }}
              >
                Pages
              </a>
              <ul
                className={`list-unstyled collapse ${pageOpen ? "show" : ""}`}
                id="pageSubmenu"
              >
                <li>
                  <a href="#">Page 1</a>
                </li>
                <li>
                  <a href="#">Page 2</a>
                </li>
                <li>
                  <a href="#">Page 3</a>
                </li>
              </ul>
            </li>

            <li>
              <a href="#">Portfolio</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>

          {/* 구독 폼 */}
          <div className="mb-5">
            <h3 className="h6">Subscribe for newsletter</h3>
            <form action="#" className="colorlib-subscribe-form">
              <div className="form-group d-flex">
                <div className="icon">
                  <span className="icon-paper-plane"></span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Email Address"
                />
              </div>
            </form>
          </div>

          {/* 푸터 */}
          <div className="footer">
            <p>
              Copyright &copy;{new Date().getFullYear()} All rights reserved |
              This template is made with{" "}
              <i className="icon-heart" aria-hidden="true"></i> by{" "}
              <a href="https://colorlib.com" target="_blank" rel="noreferrer">
                Colorlib.com
              </a>
            </p>
          </div>
        </div>
      </nav>

      {/* 페이지 컨텐츠 */}
      <div id="content" className="p-4 p-md-5 pt-5"></div>
    </div>
  );
}
