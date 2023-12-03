import React, { useState } from "react";
import "../../styles/components/Card/MainCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";

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
  const { practiceRoomId, practiceRoomName, address, roomInfoList, imageUrl } =
    card;

  // 이름순 정렬
  const sortedRoomInfoList = roomInfoList.sort((a, b) =>
    a.roomName.localeCompare(b.roomName)
  );

  return (
    <div className="main_container">
      <div className="main_title_box">
        <div className="main_card1">
          <div className="main_card_title">{practiceRoomName}</div>
        </div>
        <div className="main_img_box">
          <img src={imageUrl} alt="사진이 없습니다" />
        </div>
        <div className="main_card2">
          <div className="main_card_locate">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            {`${address}`}
          </div>
        </div>
      </div>
      <div className="main_content_box">
        {sortedRoomInfoList && sortedRoomInfoList.length > 0 && (
          <div className="scrollBar">
            <ul>
              {sortedRoomInfoList.map((roomInfo) => {
                const bookingUrl = `https://m.booking.naver.com/booking/10/bizes/${practiceRoomId}/items/${roomInfo.roomId}`;
                return (
                  <a href={bookingUrl} target="_blank" key={roomInfo.roomId}>
                    <li className="li_room">
                      <div className="room_info">
                        <div className="room_name">{roomInfo.roomName}</div>
                        <div className="room_price">
                          {roomInfo.price !== null
                            ? `${roomInfo.price}원`
                            : "가격정보없음"}
                        </div>
                      </div>
                    </li>
                  </a>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainCard;
