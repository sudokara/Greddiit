import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Navbar";

const Subgreddiit = () => {
  const { name } = useParams();

  return (
    <>
      <Navbar />
      <div>{name}</div>
    </>
  );
};

export default Subgreddiit;
