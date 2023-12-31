import React, { useState } from "react";
import "../../styles/components/Card/RatingCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

function RatingCard({ title, content, cost, locate, rating }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="container">
      <div className="title_box">
        <div className="card1">
          <div className="card_title">{title}</div>
          <div className="card_rating">&#9733; {rating}</div>
        </div>
        <div className="card2">
          <div className="rating_card_locate">
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

export default RatingCard;
