import React from "react";
import "../../styles/components/Card/MainCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

function MainCard({ card }) {
  if (!card) {
    card = {
      practiceRoomName: "Default Title",
      price: "Default Cost",
      address: "Default Location",
      roomInfoList: [
        { roomId: "1", roomName: "Default Room 1", price: 0 },
        { roomId: "2", roomName: "Default Room 2", price: 0 },
      ],
    };
  }

  const { practiceRoomName, price, address, roomInfoList } = card;

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
        </div>
      </div>
      <div className="main_content_box">
        {roomInfoList && roomInfoList.length > 0 && (
          <div className="scrollBar">
            <ul>
              {roomInfoList.map((roomInfo) => (
                <li className="li_room" key={roomInfo.roomId}>
                  <div className="room_info">
                    <div className="room_name">{roomInfo.roomName}</div>
                    <div className="room_price">
                      {roomInfo.price !== null
                        ? `${roomInfo.price}원`
                        : "정보없음"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainCard;
