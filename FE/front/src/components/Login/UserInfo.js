import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileImg from "../../assets/profile.png";
import LoginBtn from "./LoginBtn";
import LogoutBtn from "./LogoutBtn";
import "../../styles/components/Sidebar.css";

function UserInfo() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // 토큰을 가져오기
    const token = localStorage.getItem("authToken");

    // 백엔드 서버에 사용자 정보 요청
    fetch("http://43.200.181.187:8080/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // 사용자 정보 업데이트
        setUserInfo(data);
        localStorage.setItem("practiceRoomsId", data.practiceRoomsId)
        localStorage.setItem("owner",data.owner)
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, [navigate]);

  if (!userInfo) {
    return(
    <>
      <img className="profile_picture" src={profileImg} alt="프로필" />
      <div className="login_text">
        <p className="nickname">게스트</p>
        <LoginBtn />
      </div>
    </>
    );
  }

  return (
    <>
      <img className="profile_picture" src={profileImg} alt="프로필" />
      <div className="login_text">
        <p className="nickname">{userInfo.name} 님</p>
        <LogoutBtn />
      </div>
    </>
  );
}

export default UserInfo;
