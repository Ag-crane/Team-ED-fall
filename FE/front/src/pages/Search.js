import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchCard from "../components/Card/SearchCard";
import Pagination from "@mui/material/Pagination";
import "../styles/pages/Heart.css";

const Search = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(8);

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
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
      <Footer />
    </div>
  );
};

export default Search;