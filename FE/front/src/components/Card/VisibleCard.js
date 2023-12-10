import React, { useState } from "react";
import "../../styles/components/Card/VisibleCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

function VisibleCard({ title, content, locate, onClick }) {

  const handleClick = () => {
    onClick();
  };

  return (
    <div className="container" onClick={handleClick}>
      <div className="title_box">
        <div className="card1">
          <div className="card_title">{title}</div>
        </div>
        <div className="card2">
          <div className="visible_card_locate">
            <FontAwesomeIcon icon={faMapMarkerAlt} fontSize={15} />
            {locate}
          </div>
        </div>
      </div>
      <div className="content_box">
        <div>{content}</div>
      </div>
    </div>
  );
}

export default VisibleCard;
