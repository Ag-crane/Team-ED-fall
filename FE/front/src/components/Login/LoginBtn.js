import React, { Component } from "react";
import "../../styles/components/Login/LoginBtn.css";
import KAKAO from "../../assets/kakao_yellow.png";
import { Link } from "react-router-dom";

class LoginBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    return (
      <>
        <div className="to_login">
          <div className="kakao_btn_box">
          <Link to="http://43.200.181.187:8080/oauth2/authorization/kakao">
          {/* <Link to="http://localhost:8080/oauth2/authorization/kakao"> // 로컬에서 실행시 jar 실행하면서 */} 
            <img src={KAKAO} alt="로그인" className="kakao_login" />
          </Link>
          </div>
        </div>

        {/* <button className="to_login" onClick={this.openModal}>로그인</button>
        <SignIn isOpen={this.state.isModalOpen} close={this.closeModal} /> */}
      </>
    );
  }
}

export default LoginBtn;
