import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <label className="vibe-toggle-container">
      {label && <span className="vibe-toggle-label">{label}</span>}
      <div className="vibe-toggle-wrapper">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
        />
        <span className="vibe-toggle-slider"></span>
      </div>
    </label>
  );
};

export default ToggleSwitch;
