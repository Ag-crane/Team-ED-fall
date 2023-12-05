import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/Sidebar.css";
import profileImg from "../assets/profile.png";
import { FaRegHeart } from "react-icons/fa";
import LoginBtn from "./Login/LoginBtn";
import UserInfo from "./Login/UserInfo";

function Sidebar({ isOpen, toggleSidebar, sidebarRef }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showModal, setShowModal] = useState(false);

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
    if (isLoggedIn) {
      navigate("/enroll");
      toggleSidebar();
    } else {
      setShowModal(true);
    }
  };

  const handleHeartClick = () => {
    if (isLoggedIn) {
      navigate("/heart");
      toggleSidebar();
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="login_layer">
        {isLoggedIn ? (
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
          실시간 통합검색
        </button>
        <button className="page_btn" onClick={handleAboutClick}>
          전체 목록 보기
        </button>
        <button className="page_btn" onClick={handleRatingClick}>
          지도에서 찾기
        </button>
        <button className="page_btn" onClick={handleEnrollClick}>
          신규 등록하기
        </button>
      </div>
      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal">
            <button onClick={closeModal} className="modal-close-button">
              X
            </button>
            <p className="login_alert">로그인이 필요한 기능입니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;