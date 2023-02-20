import React from "react";
import Select from "react-select";

const TagSelect = ({ options, handleChange }) => {
  return (
    <div className="w-full text-primary">
      <Select
        isMulti
        name="tags"
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleChange}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            text: "#ffffff",
            neutral0: "#282a36",
            primary25: "#6272a4",
            primary: "#44475a",
            neutral80: "black",
            color: "black",
          },
        })}
      />
    </div>
  );
};

export default TagSelect;
