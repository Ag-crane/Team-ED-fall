import React, { useState } from "react";
import "../styles/components/EnrollForm.css";

function EnrollForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWbsite] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setLocation(e.target.value);
  };

  const handleWebsiteChange = (e) => {
    setLocation(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    // 클릭 시 input file을 클릭하는 코드
    document.getElementById("imageInput").click();
  };

  const handleEnroll = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("image", image);

      // Logic to send data to the server (e.g., using fetch API)
      console.log("Enrolling:", {
        name,
        location,
        description,
        image,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="enroll-form">
      <section>
        <label>이미지 등록</label>
        <div>
          {image && <img src={image} alt="합주실 이미지" />}
          <input
            type="file"
            accept="image/*"
            id="imageInput"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <div className="enroll_img_btn_block">
          <button
            className="enroll_btn"
            type="button"
            onClick={handleImageUpload}
          >
            업로드
          </button>
        </div>
      </section>
      <section>
        <label>이름</label>
        <input type="text" value={name} onChange={handleNameChange} />
        <label>전화번호</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
        />
        <label>위치</label>
        <input type="text" value={location} onChange={handleLocationChange} />
        <label>사이트 주소</label>
        <input type="text" value={website} onChange={handleWebsiteChange} />
      </section>
      <section>
        <label>상세설명</label>
        <textarea value={description} onChange={handleDescriptionChange} />
      </section>
      <section>
        <div>
          <button className="enroll_btn" type="button" onClick={handleEnroll}>
            등록
          </button>
        </div>
      </section>
    </div>
  );
}

export default EnrollForm;
