import React, { useState, useEffect } from "react";
import HeartCard from "../components/Card/HeartCard";
import Pagination from "@mui/material/Pagination";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/pages/Heart.css";

function Heart() {
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(8);

  useEffect(() => {
    async function fetchFavoriteRooms() {
      const userId = "1"; // userId가 1이라고 가정

      try {
        const response = await fetch(
          `http://43.200.181.187:8080/user-favorites/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch favorite rooms");
        }

        const favoriteRoomsData = await response.json();
        setFavoriteRooms(
          favoriteRoomsData.map((room) => ({
            id: String(room.id),
            name: room.name,
            fullAddress: room.fullAddress,
            imageUrl: room.imageUrl,
          }))
        );
      } catch (error) {
        console.error("Error fetching favorite rooms:", error);
      }
    }

    fetchFavoriteRooms();
  }, []);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = favoriteRooms.slice(
    indexOfFirstResult,
    indexOfLastResult
  );
  const totalPages = Math.ceil(favoriteRooms.length / resultsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const renderFavoriteCards = () => {
    console.log("favoriteRooms:", favoriteRooms);

    return currentResults.map((room, index) => (
      <HeartCard
        key={index}
        id={room.id}
        name={room.name}
        fullAddress={room.fullAddress}
        imageUrl={room.imageUrl}
      />
    ));
  };

  return (
    <div>
      <Header />
      <div className="heart_title">찜한 합주실</div>
      <div className="card_pack init_height">{renderFavoriteCards()}</div>
      <div className="pagination">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Heart;
