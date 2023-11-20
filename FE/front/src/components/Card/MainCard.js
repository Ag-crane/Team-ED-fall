import React, { useState } from "react";
import "../../styles/components/Card/MainCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

function MainCard({ card }) {
  if (!card) {
    card = {
      practiceRoomName: "합주실 이름",
      price: "가격",
      address: "위치",
      roomName: "룸 이름",
    };
  }

  const { practiceRoomName, price, address, roomName } = card;

  return (
    <div className="main_container">
      <div className="main_title_box">
        <div className="main_card1">
          <div className="main_card_title">{practiceRoomName}</div>
        </div>
        <div className="main_card2">
          <div className="main_card_locate">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            {`${address}`}
          </div>
          <div className="main_card_cost">{`₩${price}`}</div>
        </div>
      </div>
      <div className="main_content_box">
        <div>{roomName}</div>
      </div>
    </div>
  );
}

export default MainCard;