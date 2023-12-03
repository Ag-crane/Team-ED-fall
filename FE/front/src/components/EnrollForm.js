import React, { useState } from "react";
import "../styles/components/EnrollForm.css";

function EnrollForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value);
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
    document.getElementById("imageInput").click();
  };

  async function uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("http://43.200.181.187:8080/upload", {
        method: "POST",
        body: formData,
        headers: {
          
        },
      });
  
      if (response.ok) {
        const imageUrl = await response.text();
        console.log("Image upload successful. URL:", imageUrl);
        return imageUrl;
      } else {
        console.error("Image upload failed:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error during image upload:", error);
      return null;
    }
  }

  async function handleEnroll() {
    try {
      // 이미지 업로드
      const imageFile = document.getElementById("imageInput").files[0];
      const imageUrl = await uploadImage(imageFile);

      // 이미지 업로드 성공한 경우에만 POST 요청
      if (imageUrl) {
        const requestData = {
          name,
          thumbnail: imageUrl,
          phoneNumber,
          website,
          location,
          rate: 4.0,
        };

        const response = await fetch(
          "http://43.200.181.187:8080/practice-rooms",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(requestData),
          }
        );

        console.log("Response Status:", response.status);
        const responseBody = await response.text();
        console.log("Response Body:", responseBody);

        if (response.ok) {
          console.log("Enrollment successful");
          setName("");
          setLocation("");
          setDescription("");
          setImage(null);
          setPhoneNumber("");
          setWebsite("");
        } else {
          console.error("Enrollment failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="enroll-form">
      <section>
        <label>이미지 등록</label>
        <div className="enroll_img_box">
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
        <div className="enroll_btn_wrap">
          <button className="enroll_btn" type="button" onClick={handleEnroll}>
            등록
          </button>
        </div>
      </section>
    </div>
  );
}

export default EnrollForm;
