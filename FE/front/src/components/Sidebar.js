import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/components/Sidebar.css";
import profileImg from "../assets/profile.png";
import { FaRegHeart } from "react-icons/fa";
import LoginBtn from "./Login/LoginBtn";
import UserInfo from "./Login/UserInfo";

function Sidebar({ isOpen, toggleSidebar, sidebarRef }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfoVisible, setUserInfoVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    setIsLoggedIn(!!token);
  }, []);

  const handleHomeClick = () => {
    navigate("/");
    toggleSidebar();
  };

  const handleAboutClick = () => {
    navigate("/about");
    toggleSidebar();
  };

  const handleRatingClick = () => {
    navigate("/rating");
    toggleSidebar();
  };

  const handleEnrollClick = () => {
    navigate("/enroll");
    toggleSidebar();
  };

  const handleLoginClick = () => {
    navigate("/login");
    toggleSidebar();
  };

  const handleHeartClick = () => {
    navigate("/heart");
    toggleSidebar();
  };

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="login_layer">
      {isLoggedIn ? (
          // 로그인 상태일 때 유저 정보 표시
          <UserInfo />
        ) : (
          <>
            <img className="profile_picture" src={profileImg} alt="프로필" />
            <div className="login_text">
              <p className="nickname">게스트</p>
              <LoginBtn />
            </div>
          </>
        )}
      </div>
      <div className="heart_layer">
        <div className="heart_circle" onClick={handleHeartClick}>
        <FaRegHeart className="heart_icon" />
        </div>
      </div>
      <p className="heart">찜 목록</p>
      <div className="page_layer">
        <button className="page_btn" onClick={handleHomeClick}>
          합주실 통합검색
        </button>
        <button className="page_btn" onClick={handleAboutClick}>
          전체 합주실 목록
        </button>
        <button className="page_btn" onClick={handleRatingClick}>
          합주실 지도
        </button>
        <button className="page_btn" onClick={handleEnrollClick}>
          합주실 등록
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
