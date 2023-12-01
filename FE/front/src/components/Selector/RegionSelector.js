import React from 'react';
import "../../styles/components/Selector/RegionSelector.css"

const RegionSelector = ({ selectedRegion, onRegionChange }) => {
  return (
    <div className='region-select-box'>
      <select
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        className="dropdown-select"
      >
        <option value="default" disabled>
          지역을 선택해주세요
        </option>
        <option value="강서구">강서구</option>
        <option value="광진구">광진구</option>
        <option value="동작구">동작구</option>
        <option value="마포구 동교동">마포구 동교동</option>
        <option value="마포구 서교동">마포구 서교동</option>
        <option value="망원,연남,합정">망원, 연남, 합정</option>
        <option value="서초구">서초구</option>
        <option value="성동구">성동구</option>
        <option value="송파구">송파구</option>
        <option value="은평구">은평구</option>
        <option value="종로구">종로구</option>
      </select>
    </div>
  );
};

export default RegionSelector;