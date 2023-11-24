import React, { useState } from "react";
import "../../styles/components/Card/ListCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";

function ListCard({ title, content, cost, locate }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <div className="card_title">{title}</div>
          {/* <div className="card_cost">{cost}</div> */}
        </div>
        <div className="card2">
          <div className="card_locate">
            <FontAwesomeIcon icon={faMapMarkerAlt} fontSize={15} />
            {locate}
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
        <div>{content}</div>
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <h2>ㅇㅇㅇ</h2>
        <p>dd</p>
        {/* 여기에 상세 정보 내용 추가 */}
      </Modal>
    </div>
  );
}

export default ListCard;
