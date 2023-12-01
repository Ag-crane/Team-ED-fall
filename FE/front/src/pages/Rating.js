import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RatingCard from "../components/Card/RatingCard";
import Modal from "../components/Modal";
import markerImg from "../assets/marker.png";
import "../styles/pages/Rating.css";
import "../styles/components/Modal.css"

function Rating() {
  const [cardData, setCardData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const {
    id,
    name,
    commonAddress,
    fullAddress,
    phone,
    virtualPhone,
    imageUrl,
    hasBooking,
    bookingUrl,
    visitorReviewScore,
  } = cardData;

  useEffect(() => {
    fetchHighestRatedPracticeRooms();
    fetchAllPracticeLocations();
    getUserLocation();
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

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        //console.log("User location set:", { lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  };

  const handleMarkerHover = (location) => {
    setHoveredLocation(location);
  };

  const handleMarkerHoverOut = () => {
    setHoveredLocation(null);
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const handleModalClose = () => {
    setSelectedLocation(null);
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
        eventHandlers={{
          click: () => handleMarkerClick(location),
          mouseover: () => handleMarkerHover(location),
          mouseout: () => handleMarkerHoverOut(),
        }}
      >
        <Tooltip
          className="custom_tooltip"
          permanent={true}
          direction="top"
          offset={[0, -10]}
        >
          {hoveredLocation === location && (
            <div>
              <h5>{location.name}</h5>
            </div>
          )}
        </Tooltip>
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

  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : null;
  //console.log('User location:', userLocation);

  useEffect(() => {
    //console.log('Map Center Updated:', mapCenter);
  }, [mapCenter]);

  return (
    <div>
      <Header />
      {mapCenter && (
        <MapContainer
          center={mapCenter}
          zoom={16}
          style={{ height: "400px", paddingTop: "10px", zIndex: "1" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {renderMapMarkers()}
        </MapContainer>
      )}
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
      <Modal isOpen={!!selectedLocation} onClose={handleModalClose}>
        {selectedLocation && (
          <div className="modal-content">
          <h2 className="modal-title">{selectedLocation.name}</h2>
          <div className="modal-img-box">
            <img className="modal-image" src={selectedLocation.imageUrl} alt={name} />
          </div>
          
          <div className="modal-details">
            <p>
              <strong>주소:</strong> {selectedLocation.fullAddress}
            </p>
            <p>
              <strong>연락처:</strong> {selectedLocation.phone || selectedLocation.virtualPhone}
            </p>
            <p>
              <strong>방문자 평점:</strong>{" "}
              {selectedLocation.visitorReviewScore ? selectedLocation.visitorReviewScore : "-"}
            </p>
            <button
              onClick={() => window.open(selectedLocation.bookingUrl, "_blank")}
              disabled={hasBooking !== "True"}
            >
              예약 페이지로 이동
            </button>
          </div>
        </div>
        )}
      </Modal>
      <Footer />
    </div>
  );
}

export default Rating;
