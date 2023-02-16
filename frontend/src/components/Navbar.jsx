import React, { useEffect, useCallback, useState } from "react";
import { VscSignOut, VscHome } from "react-icons/vsc";
import { BsPerson, BsBookmarks, BsBinoculars } from "react-icons/bs";
import { FiAnchor, FiUsers } from "react-icons/fi";
import { GoReport } from "react-icons/go";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
// import jwt_decode from "jwt-decode";
import { axiosPrivate } from "../api/axios";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { ImStatsDots } from "react-icons/im";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const username = jwt_decode(
  //   localStorage.getItem("greddiit-access-token")
  // ).username;

  const [isSubMod, setIsSubMod] = useState(false);

  const pageTitles = {
    "/me": "My Profile",
    "/myr": "My Subgreddiits",
    "/saved": "Saved Posts",
    "/r": "Subgreddiits",
  };

  // noqa: no-useless-escape col 33
  // eslint-disable-next-line
  const subNameRegex = /\/r\/([^\/]+)/; // get everything between /r and the next /
  let currentPage = pageTitles[location.pathname] || "";
  const subName = subNameRegex.exec(location.pathname) || "";
  // let isSubMod = false;
  if (subName) {
    currentPage = subName[0].slice(1).replace("%20", " ");
    axiosPrivate
      .get(`/api/gr/ismod/${currentPage.slice(2)}`)
      .then((response) => {
        setIsSubMod(true);
        // console.log(response);
      })
      .catch((err) => {
        setIsSubMod(false);
      });
    // .then(console.log(isSubMod));
  }

  const handleKeyPress = useCallback(
    (event) => {
      if (
        event.target.nodeName !== "INPUT" &&
        event.target.nodeName !== "TEXTAREA"
      ) {
        // console.log(`Key pressed: ${event.key}`);
        switch (event.key) {
          case "p":
            navigate("/me");
            break;
          case "s":
            navigate("/saved");
            break;
          case "m":
            navigate("/myr");
            break;
          case "a":
            navigate("/r");
            break;
          case "h":
            if (isSubMod) {
              navigate(`/${currentPage}`);
            }
            break;
          case "u":
            if (isSubMod) {
              navigate(`/${currentPage}/users`);
            }
            break;
          case "j":
            if (isSubMod) {
              navigate(`/${currentPage}/jreqs`);
            }
            break;
          case "t":
            if (isSubMod) {
              navigate(`/${currentPage}/stats`);
            }
            break;
          case "o":
            if (isSubMod) {
              navigate(`/${currentPage}/reports`);
            }
            break;
          default:
            break;
        }
      }
    },
    [navigate, isSubMod, currentPage]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      {/* Navbar */}
      <div className="navbar flex-wrap bg-base-100 shadow-2xl mt-3 sticky top-0 z-50">
        <div className="avatar mx-3">
          <NavLink className="w-8 rounded" to="/">
            <img src={require("../assets/ghosts.png")} alt="Greddiit Ghosts" />
          </NavLink>
        </div>
        <div className="flex-1">
          <NavLink
            className="btn btn-ghost normal-case text-xl hover:bg-primary"
            to="/"
          >
            Greddiit
          </NavLink>
        </div>

        <div className="flex-1 text-xl text-primary font-bold">
          {currentPage}
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {/* <li>
              <a>Item 1</a>
            </li>
            <li>
                <a>Item 2</a>
            </li> */}

            {isSubMod ? (
              <div className="bg-accent rounded-lg flex flex-row flex-wrap">
                <li className="mx-1.5">
                  <NavLink
                    to={`/${currentPage}`}
                    className={({ isActive }) =>
                      isActive ? "bg-primary" : "hover:bg-secondary"
                    }
                  >
                    {/* {console.log(location.pathname)} */}
                    <div className="tooltip" data-tip="Sub Home">
                      <VscHome />
                    </div>
                  </NavLink>
                </li>

                <li className="mx-1.5">
                  <NavLink
                    to={`/${currentPage}/users`}
                    className={({ isActive }) =>
                      isActive ? "bg-primary" : "hover:bg-secondary"
                    }
                  >
                    <div className="tooltip" data-tip="Sub Users">
                      <FiUsers />
                    </div>
                  </NavLink>
                </li>

                <li className="mx-1.5">
                  <NavLink
                    to={`/${currentPage}/jreqs`}
                    className={({ isActive }) =>
                      isActive ? "bg-primary" : "hover:bg-secondary"
                    }
                  >
                    <div className="tooltip" data-tip="Join Requests">
                      <AiOutlineUsergroupAdd />
                    </div>
                  </NavLink>
                </li>

                <li className="mx-1.5">
                  <NavLink
                    to={`/${currentPage}/stats`}
                    className={({ isActive }) =>
                      isActive ? "bg-primary" : "hover:bg-secondary"
                    }
                  >
                    <div className="tooltip" data-tip="Sub Stats">
                      <ImStatsDots />
                    </div>
                  </NavLink>
                </li>

                <li className="mx-1.5">
                  <NavLink
                    to={`/${currentPage}/reports`}
                    className={({ isActive }) =>
                      isActive ? "bg-primary" : "hover:bg-secondary"
                    }
                  >
                    <div className="tooltip" data-tip="Sub Reports">
                      <GoReport />
                    </div>
                  </NavLink>
                </li>
              </div>
            ) : (
              ""
            )}

            <li className="mx-1.5">
              <NavLink
                to="/r"
                className={({ isActive }) =>
                  isActive ? "bg-primary" : "hover:bg-secondary"
                }
              >
                <div className="tooltip" data-tip="All Subgreddiits">
                  <BsBinoculars />
                </div>
              </NavLink>
            </li>

            <li className="mx-1.5">
              <NavLink
                to="/myr"
                className={({ isActive }) =>
                  isActive ? "bg-primary" : "hover:bg-secondary"
                }
              >
                <div className="tooltip" data-tip="My subgreddiits">
                  <FiAnchor />
                </div>
              </NavLink>
            </li>

            <li className="mx-1.5">
              <NavLink
                to="/saved"
                className={({ isActive }) =>
                  isActive ? "bg-primary" : "hover:bg-secondary"
                }
              >
                <div className="tooltip" data-tip="Saved Posts">
                  <BsBookmarks />
                </div>
              </NavLink>
            </li>

            <li className="mx-1.5">
              <NavLink
                to="/me"
                className={({ isActive }) =>
                  isActive ? "bg-primary" : "hover:bg-secondary"
                }
              >
                <div className="tooltip" data-tip="My Profile">
                  <BsPerson />
                </div>
              </NavLink>
            </li>

            <li className="mx-1.5">
              <NavLink
                to="/auth"
                onClick={() => localStorage.clear()}
                className={({ isActive }) =>
                  isActive ? "bg-primary" : "hover:bg-secondary"
                }
              >
                <div className="tooltip" data-tip="Logout">
                  <VscSignOut />
                </div>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      {/* End Navbar  */}
    </>
  );
};

export default Navbar;
