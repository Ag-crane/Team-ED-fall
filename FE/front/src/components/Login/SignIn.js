import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/components/Login/SignIn.css";

const SignIn = ({ isOpen, close }) => {


  return (
    <>
       {isOpen ? (
          <div className="login_modal">
            <div onClick={close}>
              <div className="loginModal">
                <span className="close" onClick={close}>
                  &times;
                </span>
                <div
                  className="modalContents"
                  onClick={() => (isOpen ? close() : null)}
                >
                  <div className="socialBox">
                    <div className="google">
                      <div className="googleText">구글 계정으로 로그인</div>
                    </div>
                    <div className="kakao">
                    <Link to="http://localhost:8080/oauth2/authorization/kakao">
                        <div className="kakaoText" >카카오 계정으로 로그인</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
    </>
  );
};

export default SignIn;
