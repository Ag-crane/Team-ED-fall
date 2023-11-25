import React, { useState } from "react";
import "../../styles/components/Selector/TimeSelector.css";

function TimeSelector({ selectedTimes, setSelectedTimes }) {
  const timeArrayAM = [
    "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM",
    "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"
  ];

  const timeArrayPM = [
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"
  ];

  const handleTimeClick = (time, timeArray) => {
    if (selectedTimes.length === 0) {
      setSelectedTimes([time]);
    } else {
      const clickedIndex = timeArray.findIndex((t) => t === time);
      
      const selectedIndices = selectedTimes.map((selectedTime) =>
        timeArray.findIndex((t) => t === selectedTime)
      );

      const isAdjacent = selectedIndices.some(
        (index) => Math.abs(index - clickedIndex) === 1
      );

      if (isAdjacent) {
        setSelectedTimes([time, ...selectedTimes]);
      } else {
        setSelectedTimes([time]);
      }
    }
  };

  const renderTimeButtons = (timeArray) => {
    return timeArray.map((time) => (
      <button
        key={time}
        className={`time_btn ${selectedTimes.includes(time) ? "selected" : ""}`}
        onClick={() => handleTimeClick(time, timeArray)}
      >
        <div className="time_btn_text">{time}</div>
      </button>
    ));
  };

  return (
    <div className="time_box">
      <div className="AM">
        <p className="time_text">오전</p>
        {renderTimeButtons(timeArrayAM)}
      </div>
      <p></p>
      <div className="PM">
        <p className="time_text">오후</p>
        {renderTimeButtons(timeArrayPM)}
      </div>
    </div>
  );
}

export default TimeSelector;
