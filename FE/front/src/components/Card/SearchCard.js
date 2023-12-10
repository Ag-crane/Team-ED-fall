import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "../../styles/components/Card/SearchCard.css";

const SearchCard = ({ name, fullAddress, imageUrl, onClick }) => {

  const handleClick = () => {
    onClick();
  };

  return (
    <div className="search_container" onClick={handleClick}>
      <div className="search_title_box">
        <div className="search_card1">
          <div className="search_card_title">{name}</div>
        </div>
        <div className="search_card2">
          <div className="search_card_locate">
            <FontAwesomeIcon icon={faMapMarkerAlt} fontSize={15} />
            {fullAddress}
          </div>
        </div>
      </div>
      <div className="search_content_box">
        <div>
          <img src={imageUrl} alt="사진이 없습니다" />
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
