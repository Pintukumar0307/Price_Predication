import React, { useState } from 'react';
import './ToggleSwitch.css';
import PricePred from './PricePred';
import CropClass from './CropClass';

function ToggleSwitch() {
  const [showPageA, setShowPageA] = useState(true);

  const toggleToPageA = () => {
    setShowPageA(true);
  };

  const toggleToPageB = () => {
    setShowPageA(false);
  };

  return (
    <div className="toggle-switch-container">
      <div>
        <button
          className={`toggle-button ${showPageA ? 'active' : ''}`}
          onClick={toggleToPageA}
        >
          Price Predication
        </button>
        <button
          className={`toggle-button ${showPageA ? '' : 'active'}`}
          onClick={toggleToPageB}
        >
         Crop Classification
        </button>
      </div>
      <div className="page-container">
        {showPageA ? <PricePred className="page" /> : <CropClass className="page" />}
      </div>
    </div>
  );
}

export default ToggleSwitch;
