import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import MainCard from "../components/Card/MainCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DateSelector from "../components/Selector/DateSelector";
import TimeSelector from "../components/Selector/TimeSelector";
import RegionSelector from "../components/Selector/RegionSelector";
import "../styles/pages/Home.css";

function Home() {
  const [selectedRegion, setSelectedRegion] = useState("default");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [groupedCards, setGroupedCards] = useState({});

  useEffect(() => {
    console.log("Inside useEffect");

    async function fetchData() {
      try {
        console.log("Inside fetchData");

        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const formatTime = (timeString, addHour = 0) => {
          const [hour, minute, meridian] = timeString.split(/:|\s/);
          let hours = parseInt(hour, 10);

          if (addHour) {
            hours += 1;
          }

          if (meridian === "PM" && hours < 12) {
            hours += 12;
          } else if (meridian === "AM" && hours === 12) {
            hours = 0;
          }

          return `${String(hours).padStart(2, "0")}:${minute}:00`;
        };

        console.log("Selected Date Type:", selectedDate);
        console.log(
          "Selected Times Type:",
          typeof selectedTimes,
          selectedTimes
        );

        const isValidDate = selectedDate instanceof Date;
        const isValidTimes =
          selectedTimes.length > 0 &&
          selectedTimes.every((time) => {
            const date = new Date(`2000-01-01 ${time}`);
            return !isNaN(date.getTime());
          });

        console.log("isValidDate:", isValidDate);
        console.log("isValidTimes:", isValidTimes);

        if (isValidDate && isValidTimes && selectedRegion !== "default") {
          const dateParam = formatDate(selectedDate);
          const startTimeParam = formatTime(selectedTimes[0]);
          const endTimeParam = formatTime(
            selectedTimes[selectedTimes.length - 1],
            1
          );

          const response = await fetch(
            `http://43.200.181.187:8080/rooms/available2?date=${dateParam}&startTime=${startTimeParam}&endTime=${endTimeParam}`
          );

          if (!response.ok) {
            const errorMessage = `Failed to fetch data. Status: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
          }

          const data = await response.json();

          const newGroupedCards = data.reduce((acc, card) => {
            const { practiceRoomName, roomName } = card;
            if (!acc[practiceRoomName]) {
              acc[practiceRoomName] = [];
            }
            acc[practiceRoomName].push(roomName);
            return acc;
          }, {});

          setGroupedCards(newGroupedCards);
          setCards(data);
        } else {
          console.error("Invalid date or times");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    if (selectedDate && selectedTimes.length > 0 && selectedRegion !== "default") {
      fetchData();
    }
  }, [selectedDate, selectedTimes, selectedRegion]);

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

  console.log("currentCard1:", currentCard1);
  console.log("currentCard2:", currentCard2);


  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };


  return (
    <div>
      <Header />
      <div className={`content ${cards.length > 0 ? "content-shifted" : ""}`}>
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
        </div>
        <div>
          {cards.length > 0 && (
            <div className="maincard_box">
              <div className="nav_buttons">
                <button onClick={prevCard}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </div>
              <div className="maincard_group">
                <MainCard card={currentCard1} groupedCards={groupedCards} />
                <MainCard card={currentCard2} groupedCards={groupedCards} />
              </div>
              <div className="nav_buttons">
                <button onClick={nextCard}>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
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
