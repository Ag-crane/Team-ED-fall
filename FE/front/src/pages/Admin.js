import React, { useEffect, useState } from "react";
import "../styles/pages/Admin.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BusinessDetails from "../components/BusinessDetails";
import { useParams } from "react-router-dom";

function Admin() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://43.200.181.187:8080/pr/search-by-id/${id}`);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>데이터를 불러오지 못했습니다.</div>;
  }

  return (
    <div>
      <Header />
      <div className="admin-content">
        <p><strong>&lt;{data.practiceRoomName}&gt;</strong> 관리자님 안녕하세요</p>
        <BusinessDetails data={data} id={id} />
      </div>
      <Footer />
    </div>
  );
}

export default Admin;
