import React from "react";
import "./Textbos.scss";

export const Textbox = ({
  value,
  label,
  placeholder,
  type,
  onChange,
  onSearch,
  useCurrent,
}) => {
  const handleChange = (e) => {
    const { value } = e.target;
    onChange(value);
  };

  return (
    <div className="Textbox">
      <input
        className="input"
        type={type}
        value={value}
        placeholder={placeholder}
        label={label}
        onChange={handleChange}
      />
      <button className="button" type="button" onClick={onSearch}>
        Search
      </button>
      <button className="button" type="button" onClick={useCurrent}>
        Use Current Location
      </button>
    </div>
  );
};
