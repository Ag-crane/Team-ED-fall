import React, { useState, useEffect } from "react";
import ListCard from "../components/Card/ListCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Filter from "../components/Dropdown/Filter";
import Pagination from "@mui/material/Pagination";
import "../styles/pages/About.css";

function About() {
  const [cardData, setCardData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [filteredCardData, setFilteredCardData] = useState([]);
  const [uniqueCommonAddresses, setUniqueCommonAddresses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  const [favoriteRooms, setFavoriteRooms] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const roomsResponse = await fetch(
          `http://43.200.181.187:8080/practice-rooms/sorted-by-name?page=0&size=${itemsPerPage}`
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
  
        const uniqueAddresses = [
          ...new Set(allCardData.map((card) => card.commonAddress.trim())),
        ].sort((a, b) => a.localeCompare(b));
  
        setUniqueCommonAddresses(uniqueAddresses);
        setCardData(allCardData);
        setFilteredCardData(allCardData);
        setTotalPages(Math.ceil(totalElements / itemsPerPage));
        setFilteredTotalPages(Math.ceil(totalElements / itemsPerPage));
  
        const userId = "1"; //소셜로그인 완성되면 변경해야 함
        const favoriteRoomsResponse = await fetch(
          `http://43.200.181.187:8080/user-favorites/${userId}`
        );
  
        if (!favoriteRoomsResponse.ok) {
          throw new Error("Failed to fetch favorite rooms");
        }
  
        const favoriteRoomsData = await favoriteRoomsResponse.json();
        setFavoriteRooms(favoriteRoomsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    fetchData();
  }, [itemsPerPage]);

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
      const totalElements = totalData.totalElements;

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
            !selectedValue || card.commonAddress.trim() === selectedValue.trim()
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
    const userId = "1";

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

  return (
    <div>
      <Header />
      <div className="filter-container">
        <Filter
          allUniqueAddresses={uniqueCommonAddresses}
          onChange={handleFilterChange}
        />
      </div>
      <div className="card_pack init_height">{renderFilteredCards()}</div>
      <div className="pagination">
        <Pagination
          count={selectedFilter ? filteredTotalPages : totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
      <Footer />
    </div>
  );
}

export default About;