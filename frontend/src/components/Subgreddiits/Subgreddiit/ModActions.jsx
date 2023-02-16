import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../NotFound";
import RequireSubMod from "../RequireSubMod";
import UserData from "./UserData";

const ModActions = ({ mode }) => {
  const { name } = useParams();
  const mode_pages = {
    users: <UserData />,
    jreqs: "jreqs",
    stats: "stats",
    reports: "reports",
  };

  return (
    <RequireSubMod redirectTo={`/r/${name}`} subgr={name}>
      {mode_pages[mode] || <NotFound />}
    </RequireSubMod>
  );
};

export default ModActions;
