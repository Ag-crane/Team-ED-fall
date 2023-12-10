import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchCard from "../components/Card/SearchCard";
import Pagination from "@mui/material/Pagination";
import Modal from "../components/Modal";
import "../styles/pages/Heart.css";

const Search = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(8);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const searchQuery = new URLSearchParams(location.search).get("query");
  const encodedSearchQuery = encodeURIComponent(searchQuery);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `http://43.200.181.187:8080/practice-rooms/search?name=${encodedSearchQuery}`
        );
        const data = await response.json();
        console.log(encodedSearchQuery);
        console.log(data);
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSearchResults();
  }, [encodedSearchQuery]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCardClick = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div>
      <Header />
      <div className="heart_title">검색 결과</div>
      <div className="card_pack init_height">
        {currentResults.map((room) => (
          <SearchCard
            key={room.id}
            name={room.name}
            fullAddress={room.fullAddress}
            imageUrl={room.imageUrl}
            onClick={() => handleCardClick(room)}
          />
        ))}
      </div>
      <div className="pagination">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>

      <Modal isOpen={!!selectedRoom} onClose={() => setSelectedRoom(null)}>
        {selectedRoom && (
          <div>
            <div className="popup-head">
              <span className="head-title">Team ED</span>
            </div>
            <div className="popup-body">
              <div className="body-content">
                <div className="body-titlebox">
                  <h1>{selectedRoom.name}</h1>
                </div>
                <div className="body-contentbox">
                  <div className="modal-img-box">
                    <img
                      className="modal-image"
                      src={selectedRoom.imageUrl}
                      alt={selectedRoom.name}
                    />
                  </div>
                  <div className="modal-details">
                    <p>
                      <strong>주소:</strong> {selectedRoom.fullAddress}
                    </p>
                    <p>
                      <strong>연락처:</strong>{" "}
                      {selectedRoom.phone || selectedRoom.virtualPhone}
                    </p>
                    <p>
                      <strong>방문자 평점:</strong>{" "}
                      {selectedRoom.visitorReviewScore
                        ? selectedRoom.visitorReviewScore
                        : "-"}
                    </p>
                  </div>
                  <button
                    className="popup-Re-btn"
                    onClick={() =>
                      window.open(selectedRoom.bookingUrl, "_blank")
                    }
                    disabled={selectedRoom.hasBooking !== "True"}
                  >
                    예약 페이지로 이동
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Footer />
    </div>
  );
};

export default Search;
