import React, { useState } from "react";
import "../../styles/components/Card/ListCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";

function ListCard({ cardData }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
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
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="container">
      <div className="title_box">
        <div className="card1">
          <div className="card_title">{name}</div>
          {/* <div className="card_cost">{cost}</div> */}
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
            {hasBooking === "True" && (
              <p>
                <strong>예약 가능:</strong>{" "}
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                  예약 링크
                </a>
              </p>
            )}
            {visitorReviewScore && (
              <p>
                <strong>방문자 평점:</strong> {visitorReviewScore}
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ListCard;
