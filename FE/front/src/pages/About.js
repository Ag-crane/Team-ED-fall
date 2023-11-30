import React, { useState, useEffect } from "react";
import ListCard from "../components/Card/ListCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Filter from "../components/Dropdown/Filter";
import Pagination from "@mui/material/Pagination";
import "../styles/pages/About.css";

// 오류
function About() {
  const [cardData, setCardData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [filteredCardData, setFilteredCardData] = useState([]);
  const [uniqueCommonAddresses, setUniqueCommonAddresses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);

  useEffect(() => {
    async function fetchAllCardData() {
      try {
        const response = await fetch(
          `http://43.200.181.187:8080/practice-rooms/sorted-by-name?page=0&size=${itemsPerPage}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const responseData = await response.json();
        const totalElements = responseData.totalElements;

        let allCardData = responseData.content;

        for (let page = 1; page < responseData.totalPages; page++) {
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchAllCardData();
  }, [itemsPerPage]);

  const renderFilteredCards = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const cardsToRender = selectedFilter
      ? filteredCardData.slice(startIndex, endIndex)
      : cardData.slice(startIndex, endIndex);
    console.log("cardsToRender: ", cardsToRender);

    return cardsToRender.map((cardData, index) => (
      <ListCard key={index} cardData={cardData} />
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
