import React, { useState } from "react";
import "../../styles/components/Dropdown/Filter.css";

function Filter({ options, optionLabel, onChange }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  };

  return (
    <div className="filter_dropdown">
      <label htmlFor="filter-select"></label>
      <select
        id="filter-select"
        value={selectedOption}
        onChange={handleOptionChange}
      >
        <option value="">{optionLabel}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;