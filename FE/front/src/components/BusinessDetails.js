import React, {useState} from "react";
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
    <div className="business-details">
      <table>
        <tbody>
          <tr>
            <td><strong>대표 이미지</strong></td>
            <td><img src={data.imageUrl} alt={data.name} style={{ maxWidth: '100px' }} /></td>
            <td><button>수정</button></td>
          </tr>
          <tr>
            <td><strong>ID</strong></td>
            <td>{data.id}</td>
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
                <button onClick={() => handleSave('roadAddress')}>Save</button>
              ) : (
                <button onClick={() => handleEditClick('roadAddress')}>Edit</button>
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
            <td>{data.phone}</td>
            <td><button>수정</button></td>
          </tr>
          <tr>
            <td><strong>예약 페이지</strong></td>
            <td><a href={data.bookingUrl}>{data.bookingUrl}</a></td>
            <td><button>수정</button></td>
          </tr>
          <tr>
            <td><strong>상세정보</strong></td>
            <td>{data.description}</td>
            <td><button>수정</button></td>
          </tr>
          {/* 다른 필드 추가 가능 */}
        </tbody>
      </table>
    </div>
  );
}

BusinessDetails.propTypes = {
  data: PropTypes.object.isRequired
};

export default BusinessDetails;
