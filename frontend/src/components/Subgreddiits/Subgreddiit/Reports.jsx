import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../../api/axios";
import Loading from "../../Loading";
import Navbar from "../../Navbar";
import ReportCard from "./ReportCard";

const debug = true;

const Reports = () => {
  const { name } = useParams();

  const getReports = async () => {
    try {
      const response = await axiosPrivate.get(`/api/report/${name}`);
      if (debug) console.log(response.data);
      return response.data;
    } catch (err) {
      if (debug) console.error(err);
      return null;
    }
  };

  const reportsQuery = useQuery({
    queryKey: ["reports", name],
    queryFn: getReports,
  });

  if (reportsQuery.isLoading || !reportsQuery?.data) return <Loading />;
  if (reportsQuery.err) return "Error fetching data";

  return (
    <>
      <Navbar />{" "}
      <div className="flex flex-wrap justify-around">
        {reportsQuery.data.length ? (
          reportsQuery.data.map((item) => (
            <div
              key={`${name}-report-${item.createdAt}`}
              className="md:w-1/2 lg:w-1/3 xl:w-1/4 flex justify-center my-5"
            >
              {/* <JoinRequestsCard username={item.username} subname={name} /> */}
              {/* {JSON.stringify(item)} */}
              <ReportCard report={item} />
            </div>
          ))
        ) : (
          <div className="text-lg">No reports to show</div>
        )}
      </div>
    </>
  );
};

export default Reports;
