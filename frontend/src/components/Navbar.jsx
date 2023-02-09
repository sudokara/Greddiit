import React from "react";
import { VscSignOut } from "react-icons/vsc";
import { BsPerson } from "react-icons/bs";
import { FiAnchor } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const handleProfileClick = () => {
    navigate("/me");
  };

  const handleMySubgreddiitsClick = () => {
    navigate("/gr");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-2xl mt-3">
        <div className="avatar mx-3">
          <div className="w-8 rounded" onClick={handleHomeClick}>
            <img src={require("../assets/ghosts.png")} alt="Greddiit Ghosts" />
          </div>
        </div>
        <div className="flex-1">
          <div
            className="btn btn-ghost normal-case text-xl hover:bg-primary"
            onClick={handleHomeClick}
          >
            Greddiit
          </div>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {/* <li>
              <a>Item 1</a>
            </li>
            <li>
                <a>Item 2</a>
            </li> */}
            <li>
              <label
                className="hover:bg-secondary"
                onClick={handleMySubgreddiitsClick}
              >
                <FiAnchor />
              </label>
            </li>

            <li>
              <label
                className="hover:bg-secondary"
                onClick={handleProfileClick}
              >
                <BsPerson />
              </label>
            </li>

            <li>
              <label className="hover:bg-secondary" onClick={handleLogout}>
                <VscSignOut />
              </label>
            </li>
          </ul>
        </div>
      </div>
      {/* End Navbar  */}
    </>
  );
};

export default Navbar;
