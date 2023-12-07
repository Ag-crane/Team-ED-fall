import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import MainCard from "../components/Card/MainCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DateSelector from "../components/Selector/DateSelector";
import TimeSelector from "../components/Selector/TimeSelector";
import RegionSelector from "../components/Selector/RegionSelector";
import Spinner from "../components/Spinner";
import "../styles/pages/Home.css";

function Home() {
  const [selectedRegion, setSelectedRegion] = useState("default");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [formattedDate, setFormattedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [groupedCards, setGroupedCards] = useState({});
  const [afterSearch, setAfterSearch] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // 관리자페이지 로컬 작업 위한 임시 변수
  localStorage.setItem('practiceRoomsId', 123456)
  localStorage.setItem('owner',true)

  useEffect(() => {
    const isValidDate = selectedDate instanceof Date;
    const isValidTimes = selectedTimes.length > 0;
    const isRegionSelected = selectedRegion !== "default";

    setIsButtonActive(isValidDate && isValidTimes && isRegionSelected);

    if (isValidDate && isValidTimes) {
      const sortedTimes = [...selectedTimes].sort();
      const newStartTime = formatTime(sortedTimes[0]);
      const newEndTime = formatTime(sortedTimes[sortedTimes.length - 1], 1);
      const newFormattedDate = formatDate(selectedDate);

      setFormattedDate(newFormattedDate);
      setStartTime(newStartTime);
      setEndTime(newEndTime);
    }
  }, [selectedDate, selectedTimes, selectedRegion]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeString, addHour = 0) => {
    const [hour, minute, meridian] = timeString.split(/:|\s/);
    let hours = parseInt(hour, 10);

    // AM/PM을 기반으로 24시간 형식으로 변환
    if (meridian === "PM" && hours < 12) {
      hours += 12;
    } else if (meridian === "AM" && hours === 12) {
      hours = 0;
    }

    // 시간 추가
    if (addHour) {
      hours += 1;
    }

    // 24시간 형식 조정
    if (hours === 24) {
      return `00:00:00`; // 다음 날 00:00:00
    } else {
      return `${String(hours).padStart(2, "0")}:${minute}:00`;
    }
  };

  const fetchDB = async () => {
    const response = await fetch(
      `http://43.200.181.187:8080/rooms/available/location2?date=${formattedDate}&startTimeString=${startTime}&endTimeString=${endTime}&gu=${selectedRegion}`
    );
    if (!response.ok) {
      throw new Error("DB fetch error");
    }
    return response.json();
  };

  const fetchCrawler = async () => {
    const response = await fetch(
      `http://43.200.181.187:8080/realtime-crawler/available-rooms3?date=${formattedDate}&startTimeString=${startTime}&endTimeString=${endTime}&gu=${selectedRegion}`
    );
    if (!response.ok) {
      throw new Error("Crawler fetch error");
    }
    return response.json();
  };

  function groupCards(data) {
    return data.reduce((acc, card) => {
      const { practiceRoomName, roomName } = card;
      if (!acc[practiceRoomName]) {
        acc[practiceRoomName] = [];
      }
      acc[practiceRoomName].push(roomName);
      return acc;
    }, {});
  }

  async function fetchData() {
    console.log(selectedRegion)
    setIsLoading(true);
    try {

      // if (selectedRegion === "마포구 동교동" || selectedRegion === "마포구 서교동" || selectedRegion === "망원, 연남, 합정"){
      //   const crawlerData = await fetchDB();
      //   setCards(crawlerData);
      //   setGroupedCards(groupCards(crawlerData));
      // }
      // const data = await fetchCrawler();
      // setCards(data);
      // setGroupedCards(groupCards(data));

      const data = await fetchDB();
      setCards(data);
      setGroupedCards(groupCards(data));
      
      // if (selectedRegion === "마포구 동교동" || selectedRegion === "마포구 서교동" || selectedRegion === "망원,연남,합정"){
      //   const crawlerData = await fetchCrawler();
      //   setCards(crawlerData);
      //   setGroupedCards(groupCards(crawlerData));
      // }

    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = () => {
    if (isButtonActive) {
      fetchData();
      setAfterSearch(!afterSearch);
      setSearchPerformed(true);
    }
  };

  const nextCard = () => {
    const nextIndex = (currentIndex + 2) % cards.length;
    setCurrentIndex(nextIndex);
  };

  const prevCard = () => {
    const prevIndex = (currentIndex - 2 + cards.length) % cards.length;
    setCurrentIndex(prevIndex);
  };

  const currentCard1 = cards[currentIndex];
  const currentCard2 = cards[(currentIndex + 1) % cards.length];

  const availablePracticeRooms = Object.keys(groupedCards);
  const hasMultipleRooms = availablePracticeRooms.length > 1;

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };

  return (
    <div>
      <Header />
      <div className={`content ${afterSearch ? "content-shifted" : ""}`}>
        <p className="time_title">원하는 지역, 날짜, 시간을 선택하세요</p>
        <div className="selector">
          <RegionSelector
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
          />
          <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <p />
          <TimeSelector
            selectedTimes={selectedTimes}
            setSelectedTimes={setSelectedTimes}
          />
          <button
            className="search_button"
            onClick={handleSearch}
            disabled={!isButtonActive}
          >
            검색하기
          </button>
        </div>
        <div className={afterSearch && searchPerformed ? "" : "hidden"}>
          {isLoading ? (
            <div>
              <Spinner />
            </div>
          ) : (
            <div className="maincard_box">
              <div className={`${afterSearch ? "content-shifted" : ""}`}>
                {cards.length > 0 ? (
                  <>
                    <div className="nav_buttons">
                      <button onClick={prevCard}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </button>
                    </div>
                    <div className="maincard_group">
                      {hasMultipleRooms ? (
                        <>
                          <MainCard
                            card={currentCard1}
                            groupedCards={groupedCards}
                          />
                          <MainCard
                            card={currentCard2}
                            groupedCards={groupedCards}
                          />
                        </>
                      ) : (
                        <MainCard
                          card={currentCard1}
                          groupedCards={groupedCards}
                        />
                      )}
                    </div>
                    <div className="nav_buttons">
                      <button onClick={nextCard}>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    </div>
                  </>
                ) : afterSearch && cards.length === 0 ? (
                  <div className="noroom_container">
                    <p className="noroom_text">
                      이용 가능한 합주실이 없습니다.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
