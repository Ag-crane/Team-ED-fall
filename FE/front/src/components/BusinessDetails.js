import React, { useState } from "react";
import PropTypes from 'prop-types';
import "../styles/components/BusinessDetails.css";

function BusinessDetails({ data, id }) {
  const [editMode, setEditMode] = useState({});
  const [formData, setFormData] = useState({ ...data });

  const handleEditClick = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleChange = (field, value, index) => {
    if (field.startsWith('room')) {
      const updatedRooms = formData.roomInfoList.map((room, idx) => {
        if (idx === index) {
          if (field === `roomName${index}`) {
            return { ...room, roomName: value };
          } else if (field === `roomPrice${index}`) {
            return { ...room, price: Number(value) };
          }
        }
        return room;
      });
      setFormData({ ...formData, roomInfoList: updatedRooms });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSave = async (field, index = null) => {
    console.log("Saved Data", formData);
    let response;
    if (index !== null) {
      setEditMode({ ...editMode, [field]: false });
      console.log("디버깅",formData, field, index)
      const roomDataId = formData.roomInfoList[index].roomId
      response = await fetch(`http://43.200.181.187:8080/room-data/${roomDataId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.roomInfoList[index]),
      })
    }
    else {
      setEditMode({ ...editMode, [field]: false });
      response = await fetch(`http://43.200.181.187:8080/pr/${id}/${field}?${field}=${formData[field]}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    const json = await response.json();
    console.log("formData:", formData);
    console.log("json:", json);
    alert("성공적으로 저장되었습니다.");
  };

  return (
    <>
      <div className="business-details">
        <table>
          <tbody>
            <tr>
              <td><strong>대표 이미지</strong></td>
              <td><img src={data.imageUrl} alt={data.practiceRoomName} style={{ maxWidth: '100px' }} /></td>
              <td><button>수정</button></td>
            </tr>
            <tr>
              <td><strong>ID</strong></td>
              <td>{data.practiceRoomId}</td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>도로명 주소</strong></td>
              <td>
                {editMode.roadAddress ? (
                  <input
                    type="text"
                    value={formData.roadAddress}
                    onChange={(e) => handleChange('roadAddress', e.target.value)}
                  />
                ) : (
                  <span>{formData.roadAddress}</span>
                )}
              </td>
              <td>
                {editMode.roadAddress ? (
                  <button onClick={() => handleSave('roadAddress')}>저장</button>
                ) : (
                  <button onClick={() => handleEditClick('roadAddress')}>수정</button>
                )}
              </td>
            </tr>
            <tr>
              <td><strong>지번 주소</strong></td>
              <td>
                {editMode.fullAddress ? (
                  <input
                    type="text"
                    value={formData.fullAddress}
                    onChange={(e) => handleChange('fullAddress', e.target.value)}
                  />
                ) : (
                  <span>{formData.fullAddress}</span>
                )}
              </td>
              <td>
                {editMode.fullAddress ? (
                  <button onClick={() => handleSave('fullAddress')}>저장</button>
                ) : (
                  <button onClick={() => handleEditClick('fullAddress')}>수정</button>
                )}
              </td>
            </tr>
            <tr>
              <td><strong>전화번호</strong></td>
              <td>
                {editMode.phoneNumber ? (
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  />
                ) : (
                  <span>{formData.phoneNumber}</span>
                )}
              </td>
              <td>
                {editMode.phoneNumber ? (
                  <button onClick={() => handleSave('phoneNumber')}>저장</button>
                ) : (
                  <button onClick={() => handleEditClick('phoneNumber')}>수정</button>
                )}
              </td>
            </tr>
            <tr>
              <td><strong>예약 페이지</strong></td>
              <td>
                {editMode.bookingUrl ? (
                  <input
                    type="text"
                    value={formData.bookingUrl}
                    onChange={(e) => handleChange('bookingUrl', e.target.value)}
                  />
                ) : (
                  <a href={formData.bookingUrl}><span>{formData.bookingUrl}</span></a>
                )}
              </td>
              <td>
                {editMode.bookingUrl ? (
                  <button onClick={() => handleSave('bookingUrl')}>저장</button>
                ) : (
                  <button onClick={() => handleEditClick('bookingUrl')}>수정</button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="business-details roomInfo">
        <table>
          <thead>
            <tr>
              <td colSpan="4"><strong>룸 정보</strong></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>가격</th>
              <th>작업</th>
            </tr>
            {formData.roomInfoList.map((room, index) => (
              <tr key={room.roomId}>
                <td>{room.roomId}</td>
                <td>
                  {editMode[`room${index}`] ? (
                    <input
                      type="text"
                      value={room.roomName}
                      onChange={(e) => handleChange(`roomName${index}`, e.target.value, index)}
                    />
                  ) : (
                    <span>{room.roomName}</span>
                  )}
                </td>
                <td>
                  {editMode[`room${index}`] ? (
                    <input
                      type="number"
                      value={room.price}
                      onChange={(e) => handleChange(`roomPrice${index}`, e.target.value, index)}
                    />
                  ) : (
                    <span>{room.price} 원</span>
                  )} 
                </td>
                <td>
                  {editMode[`room${index}`] ? (
                    <button onClick={() => handleSave(`room${index}`, index)}>저장</button>
                  ) : (
                    <button onClick={() => handleEditClick(`room${index}`, index)}>수정</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

BusinessDetails.propTypes = {
  data: PropTypes.object.isRequired
};

export default BusinessDetails;
