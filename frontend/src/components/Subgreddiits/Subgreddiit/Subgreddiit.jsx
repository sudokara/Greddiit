import React from "react";
import { useParams } from "react-router-dom";

const Subgreddiit = () => {
  const { name } = useParams();

  return <div>{name}</div>;
};

export default Subgreddiit;
