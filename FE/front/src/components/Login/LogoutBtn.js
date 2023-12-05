import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../styles/components/Login/LogoutBtn.css";
import KAKAO from "../../assets/kakao_yellow.png";

function LogoutBtn() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      setUserInfo({});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <div className="to_login">
      {userInfo ? (
        <div  className="kakao_btn_box" onClick={handleLogout}>
          <img src={KAKAO} alt="로그인" className="kakao_login" />
        </div>
      ) : (
        <span>User not logged in</span>
      )}
    </div>
  );
}

export default LogoutBtn;
