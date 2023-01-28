import React from "react";

const Input = ({ type, label, isDisabled, value, setValue }) => {
  
    return (
    <div className="card-body form-control ml-2">
      <label className="label">
        <span className="label-text ">{label}</span>
      </label>
      <input
        type={type}
        disabled={isDisabled}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className="input input-bordered input-secondary w-full max-w-xs"
      />
    </div>
  );
};

export default Input;
