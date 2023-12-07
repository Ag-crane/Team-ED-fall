import React, { useState } from "react";
import PropTypes from 'prop-types';
import "../styles/components/BusinessDetails.css";

function BusinessDetails({ data }) {
  const [editMode, setEditMode] = useState({});
  const [formData, setFormData] = useState({ ...data });

  const handleEditClick = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = (field) => {
    console.log("Saved Data", formData);
    setEditMode({ ...editMode, [field]: false });
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
              <td><button>수정</button></td>
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
              <td>{data.fullAddress}</td>
              <td><button>수정</button></td>
            </tr>
            <tr>
              <td><strong>전화번호</strong></td>
              <td>{data.phoneNumber}</td>
              <td><button>수정</button></td>
            </tr>
            <tr>
              <td><strong>예약 페이지</strong></td>
              <td><a href={data.bookingUrl}>{data.bookingUrl}</a></td>
              <td><button>수정</button></td>
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
                  {editMode[`roomName${index}`] ? (
                    <input
                      type="text"
                      value={room.roomName}
                      onChange={(e) => handleChange('roomName', e.target.value, index)}
                    />
                  ) : (
                    <span>{room.roomName}</span>
                  )}
                </td>
                <td>
                  {editMode[`price${index}`] ? (
                    <input
                      type="number"
                      value={room.price}
                      onChange={(e) => handleChange('price', e.target.value, index)}
                    />
                  ) : (
                    <span>{room.price} 원</span>
                  )}
                </td>
                <td>
                  {editMode[`roomName${index}`] || editMode[`price${index}`] ? (
                    <button onClick={() => handleSave('room', index)}>저장</button>
                  ) : (
                    <button onClick={() => handleEditClick('room', index)}>수정</button>
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
