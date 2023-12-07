import React, { useState, useEffect } from "react";
import ListCard from "../components/Card/ListCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Filter from "../components/Dropdown/Filter";
import Pagination from "@mui/material/Pagination";
import "../styles/pages/List.css";

function List() {
  const [cardData, setCardData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [filteredCardData, setFilteredCardData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sortByRating, setSortByRating] = useState(false);

  const regions = [
    "강남구",
    "강동구",
    "강서구",
    "광진구",
    "금천구",
    "노원구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "송파구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
  ];
  const sort = ["이름순", "평점순"];

  useEffect(() => {
    async function fetchUserInfo() {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const response = await fetch("http://43.200.181.187:8080/user/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user info");
          }

          const userData = await response.json();
          console.log("User Info:", userData);
          setUserInfo(userData);

        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    }

    fetchUserInfo();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = userInfo?.id || "";

        const sortEndpoint = sortByRating
          ? "sorted-by-rating"
          : "sorted-by-name";

        const roomsResponse = await fetch(
          `http://43.200.181.187:8080/practice-rooms/${sortEndpoint}?page=0&size=${itemsPerPage}`
        );

        if (!roomsResponse.ok) {
          throw new Error("Failed to fetch practice rooms");
        }

        const roomsData = await roomsResponse.json();
        const totalElements = roomsData.totalElements;

        let allCardData = roomsData.content;

        for (let page = 1; page < roomsData.totalPages; page++) {
          const nextPageResponse = await fetch(
            `http://43.200.181.187:8080/practice-rooms/sorted-by-name?page=${page}&size=${itemsPerPage}`
          );

          if (!nextPageResponse.ok) {
            throw new Error("Failed to fetch data for page " + page);
          }

          const nextPageData = await nextPageResponse.json();
          allCardData = [...allCardData, ...nextPageData.content];
        }

        setCardData(allCardData);
        setFilteredCardData(allCardData);
        setTotalPages(Math.ceil(totalElements / itemsPerPage));
        setFilteredTotalPages(Math.ceil(totalElements / itemsPerPage));

        if (userId) {
          const favoriteRoomsResponse = await fetch(
            `http://43.200.181.187:8080/user-favorites/${userId}`
          );

          if (!favoriteRoomsResponse.ok) {
            throw new Error("Failed to fetch favorite rooms");
          }

          const favoriteRoomsData = await favoriteRoomsResponse.json();
          setFavoriteRooms(favoriteRoomsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();

  }, [itemsPerPage, userInfo, sortByRating, selectedFilter]);

  const renderFilteredCards = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const cardsToRender = selectedFilter
      ? filteredCardData.slice(startIndex, endIndex)
      : cardData.slice(startIndex, endIndex);

    return cardsToRender.map((cardData, index) => (
      <ListCard
        key={index}
        cardData={cardData}
        onToggleFavorite={toggleFavorite}
        favoriteRooms={favoriteRooms}
      />
    ));
  };

  const handleFilterChange = async (selectedValue) => {
    setSelectedFilter(selectedValue);
    setCurrentPage(1);

    try {
      const totalResponse = await fetch(
        `http://43.200.181.187:8080/practice-rooms/sorted-by-name?page=0&size=${itemsPerPage}`
      );

      if (!totalResponse.ok) {
        throw new Error("Failed to fetch total data");
      }

      const totalData = await totalResponse.json();

      let filteredCardData = [];

      for (let page = 0; page < totalData.totalPages; page++) {
        const response = await fetch(
          `http://43.200.181.187:8080/practice-rooms/sorted-by-name?page=${page}&size=${itemsPerPage}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data for page ${page}`);
        }

        const responseData = await response.json();

        const filteredPageData = responseData.content.filter(
          (card) =>
            !selectedValue ||
            card.commonAddress.trim().includes(selectedValue.trim())
        );

        filteredCardData = [...filteredCardData, ...filteredPageData];
      }

      const filteredTotalPages = Math.ceil(
        filteredCardData.length / itemsPerPage
      );

      setFilteredCardData(filteredCardData);
      setFilteredTotalPages(filteredTotalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleFavorite = async (practiceRoomsID) => {
    const userId = userInfo?.id || "";

    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    try {
      const url = `http://43.200.181.187:8080/user-favorites/add/${userId}?practiceRoomsId=${practiceRoomsID}`;
      console.log("Toggle Favorite URL:", url);

      const response = await fetch(url, {
        method: "POST",
      });

      console.log("Toggle Favorite Response Status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to toggle favorite status");
      }

      if (userId) {
        const updatedFavoriteRoomsResponse = await fetch(
          `http://43.200.181.187:8080/user-favorites/${userId}`
        );

        if (!updatedFavoriteRoomsResponse.ok) {
          throw new Error("Failed to fetch updated favorite rooms");
        }

        const updatedFavoriteRoomsData =
          await updatedFavoriteRoomsResponse.json();
        console.log("Favorite Rooms Data:", updatedFavoriteRoomsData);
        setFavoriteRooms(updatedFavoriteRoomsData);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage);

    try {
      const response = await fetch(
        `http://43.200.181.187:8080/practice-rooms/sorted-by-name?page=${
          newPage - 1
        }&size=${itemsPerPage}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data for page ${newPage}`);
      }

      const responseData = await response.json();

      const filteredPageData = selectedFilter
        ? responseData.content.filter(
            (card) => card.commonAddress.trim() === selectedFilter.trim()
          )
        : responseData.content;

      const startIndex = (newPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const cardsForCurrentPage = filteredPageData.slice(startIndex, endIndex);

      setFilteredCardData(cardsForCurrentPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSortChange = async (selectedValue) => {
    setSortByRating(selectedValue === "평점순");
    setCurrentPage(1);
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div>
      <Header />
      <div className="filter-container">
        <Filter
          optionLabel="지역 선택"
          options={regions}
          onChange={handleFilterChange}
        />
        <div className="sort_filter">
          <Filter
            optionLabel="정렬 선택"
            options={sort}
            onChange={handleSortChange}
          />
        </div>
      </div>
      <div className="card_pack init_height">{renderFilteredCards()}</div>

      <div className="pagination">
        <Pagination
          count={selectedFilter ? filteredTotalPages : totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
      {showLoginModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal">
            <button onClick={closeModal} className="modal-close-button">
              X
            </button>
            <p className="login_alert">로그인이 필요한 기능입니다.</p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default List;
