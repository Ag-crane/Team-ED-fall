import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../styles/components/Login/SignIn.css";
import HorizonLine from "../../utils/HorizontalLine";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
  };

  loginHandler = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };


  render() {
    const { isOpen, close } = this.props;
    return (
      <>
        {isOpen ? (
          <div className="login_modal">
            <div onClick={close}>
              <div className="loginModal">
                <span className="close" onClick={close}>
                  &times;
                </span>
                <div className="modalContents" onClick={() => isOpen ? close() : null}>
                  <div className="socialBox">
                    <div className="google">
                      <div className="googleText">구글 계정으로 로그인</div>
                    </div>
                    <div className="kakao">
                      <Link to="http://43.200.181.187:8080/oauth2/authorization/kakao">
                        {/* 현재 localhost에서는 소셜로그인 불가 */}
                        <div className="kakaoText">카카오 계정으로 로그인</div>
                      </Link>
                    </div>
                  </div>
                  <HorizonLine text="또는" />
                  <input
                    name="email"
                    className="inputId"
                    type="text"
                    placeholder="아이디"
                    onChange={this.loginHandler}
                  />
                  <input
                    name="password"
                    className="inputPw"
                    type="password"
                    placeholder="비밀번호"
                    onChange={this.loginHandler}
                  />
                  <div className="loginMid">
                    <label className="autoLogin" for="hint">
                      {" "}
                      <input type="checkbox" id="hint" /> 로그인 유지하기
                    </label>
                    <div className="toSignin">회원가입</div>
                  </div>
                  <button className="loginBtn">
                    {" "}
                    로그인{" "}
                  </button>

                  <div className="loginEnd"></div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

export default SignIn;
