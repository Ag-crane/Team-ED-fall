import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/Sidebar.css";
import "../styles/components/Modal.css";
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

  const handleListClick = () => {
    navigate("/list");
    toggleSidebar();
  };

  const handleMapClick = () => {
    navigate("/map");
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

  const handleAdminClick = () => {
    if (localStorage.getItem("owner") === "true") {
      const practiceRoomsId = localStorage.getItem("practiceRoomsId");
      navigate(`/admin/${practiceRoomsId}`);
      toggleSidebar();
    }
    else if (isLoggedIn) {
      navigate("/admin");
      toggleSidebar();
    } else {
      setShowModal(true);
    }
  }

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
        <button className="page_btn" onClick={handleListClick}>
          전체 목록 보기
        </button>
        <button className="page_btn" onClick={handleMapClick}>
          지도에서 찾기
        </button>
        <button className="page_btn" onClick={handleEnrollClick}>
          신규 등록하기
        </button>
        <button className="page_btn" onClick={handleAdminClick}>
          정보 수정하기
        </button>
      </div>
      {showModal && (
        <div class="modal-container" onClick={closeModal}>
        <div class="modal-backdrop" id="popup">
          <div class="popup">
            <div class="popup-head">
                <span class="head-title">Team ED</span>
            </div>
            <div class="popup-body">
              <div class="body-content">
                <div class="body-titlebox">
                  <div className="popup-text">로그인이 필요한 기능입니다.</div>
                </div>
              </div>
            </div>
            <div class="popup-foot">
              <span class="pop-btn confirm" id="confirm">확인</span>
            </div>
          </div>
      </div>
      </div>
      )}
    </div>
  );
}

export default Sidebar;