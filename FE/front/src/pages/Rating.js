import React, { useState, useEffect } from "react";
import ListCard from "../components/Card/ListCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RatingCard from "../components/Card/RatingCard";
import "../styles/pages/Rating.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import markerImg from "../assets/marker.png";

function Rating() {
  const [cardData, setCardData] = useState([]);
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    fetchHighestRatedPracticeRooms();
    fetchAllPracticeLocations();
  }, []);

  const fetchHighestRatedPracticeRooms = async () => {
    try {
      const response = await fetch(
        "http://43.200.181.187:8080/practice-rooms/sorted-by-rating?page=0&size=4"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch highest-rated practice rooms");
      }
      const data = await response.json();
      setCardData(data.content || []);
    } catch (error) {
      console.error("Error fetching highest-rated practice rooms:", error);
    }
  };

  const fetchAllPracticeLocations = async () => {
    try {
      const response = await fetch(
        "http://43.200.181.187:8080/practice-rooms/sorted-by-name?page=0&size=1000"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch practice room locations");
      }
      const data = await response.json();
      setLocationData(data.content || []);
    } catch (error) {
      console.error("Error fetching practice room locations:", error);
    }
  };

  const renderMapMarkers = () => {
    return locationData.map((location, index) => (
      <Marker
        key={index}
        position={[parseFloat(location.y), parseFloat(location.x)]}
        icon={L.icon({
          iconUrl: markerImg,
          iconSize: [25, 30],
        })}
      >
        <Popup>{location.name}</Popup>
      </Marker>
    ));
  };

  const renderCards = () => {
    return cardData.map((card, index) => (
      <RatingCard
        key={index}
        title={card.name}
        cost={card.cost}
        locate={card.fullAddress}
        content={<img src={card.imageUrl} alt="사진이 없습니다." />}
        rating={card.visitorReviewScore}
      />
    ));
  };

  return (
    <div>
      <Header />
      <MapContainer
        center={[37.5562, 126.9239]}
        zoom={16}
        style={{ height: "400px", paddingTop: "10px", zIndex: "1" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {renderMapMarkers()}
      </MapContainer>
      <div>
        <div className="rating_title">
          평점 높은 순
          <span className="icon-container">
            <FontAwesomeIcon
              icon={faThumbsUp}
              className="far fa-thumbs-up thumbs-up-icon"
            />
          </span>
        </div>
        <div className="rating_card_pack">{renderCards()}</div>
      </div>
      <Footer />
    </div>
  );
}

export default Rating;
