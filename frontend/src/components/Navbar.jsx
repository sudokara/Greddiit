import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();

  const handleLogout = () => {
    // console.log("logout");
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-2xl mt-3">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl hover:bg-primary">Greddiit</a>
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
              <label className="hover:bg-secondary" onClick={handleLogout}>Logout</label>
            </li>
          </ul>
        </div>
      </div>
      {/* End Navbar  */}
    </>
  );
};

export default Navbar;
