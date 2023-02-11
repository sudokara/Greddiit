import React from "react";
import { useState } from "react";

const Tests = ({ tags }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleNewTagSubmit = (event) => {
    event.preventDefault();
    setSelectedTags([...selectedTags, newTag]);
    setNewTag("");
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap">
        {tags.map((tag) => (
          <div
            key={tag}
            className={`bg-gray-200 text-gray-800 font-medium px-2 py-1 mr-1 mb-1 rounded-full cursor-pointer ${
              selectedTags.includes(tag) ? "bg-indigo-500 text-white" : ""
            }`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </div>
        ))}
        <form onSubmit={handleNewTagSubmit} className="flex-shrink-0">
          <input
            type="text"
            value={newTag}
            onChange={(event) => setNewTag(event.target.value)}
            placeholder="Create your own tag"
            className="bg-gray-200 px-2 py-1 rounded-full"
          />
        </form>
      </div>
    </div>
  );
};

export default Tests;
