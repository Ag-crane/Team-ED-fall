import React from "react";
import "../styles/pages/Admin.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Admin() {
  return (
    <div>
      <Header />
      <div className="admin-content">
      관리자 페이지
      </div>
      <Footer />
    </div>
  );
}

export default Admin;
