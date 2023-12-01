import React, { useState } from "react";
import "../../styles/components/Card/ListCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";

const ListCard = ({ cardData, onToggleFavorite, favoriteRooms }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const isFavorite =
    favoriteRooms && favoriteRooms.some((room) => room.id === id);

  const toggleFavorite = () => {
    onToggleFavorite(id);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="container">
      <div className="title_box">
        <div className="card1">
          <div className="card_title">{name}</div>
        </div>
        <div className="card2">
          <div className="card_locate">
            <FontAwesomeIcon icon={faMapMarkerAlt} fontSize={15} />
            {commonAddress}
          </div>
          <div
            className={`card_heart ${isFavorite ? "active" : ""}`}
            onClick={toggleFavorite}
          >
            <FontAwesomeIcon icon={faHeart} />
          </div>
        </div>
      </div>
      <div className="content_box" onClick={toggleModal}>
        <div>
          <img src={imageUrl} alt="사진이 없습니다" />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className="modal-content">
          <h2 className="modal-title">{name}</h2>
          <img className="modal-image" src={imageUrl} alt={name} />
          <div className="modal-details">
            <p>
              <strong>주소:</strong> {fullAddress}
            </p>
            <p>
              <strong>연락처:</strong> {phone || virtualPhone}
            </p>
            <p>
              <strong>방문자 평점:</strong>{" "}
              {visitorReviewScore ? visitorReviewScore : "-"}
            </p>
            <button
              onClick={() => window.open(bookingUrl, "_blank")}
              disabled={hasBooking !== "True"}
            >
              예약 페이지로 이동
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListCard;
