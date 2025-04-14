import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Col, Card, Row, Table } from "react-bootstrap";
import { DollarSign, ShoppingBag } from "react-feather";
import SCard from "src/components/general/SCard";
import { getObjectData, getviewData } from "../LeaveService";

let currentYear = new Date().getFullYear();
const Statistics = () => {
  const { t } = useTranslation();

  const [leaveData, setLeaveData] = useState(null);
  const [upcomingLeaves, setUpcomingLeaves] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [selectedYear, setSelectedYear] = useState(0);
  const [year, setyear] = useState("");
  const viewParams = {
    viewName: "pa_lm_holiday_statistics_v",
    pageNumber: 1,
    pageSize: 3,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: "(created_by=0 or created_by=:USER_ID)",
  };

  const leaveParams = {
    viewName: "pa_lm_leave_statistics_v",
    pageNumber: 1,
    pageSize: 3,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: "(created_by=:USER_ID)",
  };
  const ledgerservice = {
    viewName: "pa_lm_leave_ledger_details_v",
    pageNumber: 1,
    pageSize: 3,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `:USER_ID=user_id and year=${year}`,
  };
  useEffect(() => {
    // if (userId) {
    getObjectData("getFiscalYear")
      .then((response) => {
        const responseData = response.data;
        if (responseData.data.length > 0) {
          setyear(responseData.data[0].year);
        } else {
          setyear(currentYear);
        }
      })
      .catch((error) => {
        setyear(currentYear);
        console.error(error);
      });
    getviewData(viewParams)
      .then((response) => {
        const responseData = response.data.data;

        setUpcomingHolidays(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
    getviewData(leaveParams)
      .then((response) => {
        const responseData = response.data.data;
        console.log(responseData, "responseDataresponseData");

        setUpcomingLeaves(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
    // }
  }, []);

  useEffect(() => {
    if (year > 0) {
      getviewData(ledgerservice)
        .then((response) => {
          const responseData = response.data;
          setLeaveData(responseData.data[0]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [year]);

  function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayOfWeek];
  }

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-lg-12">
          {leaveData && (
            <Card className="w-100 mb-2 ">
              <Card.Header className="pb-0">
                <Card.Title className="m-0 p-0">Available Leave(s)</Card.Title>
                <hr className="mb-0" />
              </Card.Header>
              <Card.Body className="pb-0 pt-0">
                <div className="overflow-auto">
                  <Table hover className="">
                    {/* ... (Table content) */}
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th className="text-center">Eligibility</th>
                        <th className="text-center">Availed</th>
                        <th className="text-center">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Add "p-0" class to remove padding */}
                      {/* {leaveData.total_casual_leaves > 0 && ( */}
                      <tr className="p-0 ">
                        <td className="p-0 ps-2">Casual Leave(s)</td>
                        <td className="p-0 text-center">
                          {leaveData.total_casual_leaves}
                        </td>
                        <td className="p-0 text-center">
                          {leaveData.total_casual_leaves -
                            leaveData.available_casual_leaves}
                        </td>
                        <td className="p-0 text-center">
                          {leaveData.available_casual_leaves}
                        </td>
                      </tr>
                      {/* )} */}
                      {/* {leaveData.total_earned_leaves > 0 && ( */}
                      <tr className="p-0">
                        <td className="p-0 ps-2">Earned Leave(s)</td>
                        <td className="p-0 text-center">
                          {leaveData.total_earned_leaves}
                        </td>
                        <td className="p-0 text-center">
                          {leaveData.total_earned_leaves -
                            leaveData.available_earned_leaves}
                        </td>
                        <td className="p-0 text-center">
                          {leaveData.available_earned_leaves}
                        </td>
                      </tr>
                      {/* )} */}
                      {/* {(leaveData.gender === 2 || leaveData.gender === 1) && leaveData.total_maternity_leaves > 0 && ( */}
                      <tr className="p-0">
                        <td className="p-0 ps-2">
                          {leaveData.gender === 2
                            ? "Maternity Leave(s)"
                            : "Paternity Leave(s)"}
                        </td>
                        <td className="p-0 text-center">
                          {leaveData.gender === 2
                            ? leaveData.total_maternity_leaves
                            : leaveData.total_paternity_leaves}
                        </td>
                        <td className="p-0 text-center">
                          {leaveData.gender === 2
                            ? leaveData.total_maternity_leaves -
                              leaveData.available_maternity_leaves
                            : leaveData.total_paternity_leaves -
                              leaveData.available_paternity_leaves}
                        </td>
                        <td className="p-0 text-center">
                          {leaveData.gender === 2
                            ? leaveData.available_maternity_leaves
                            : leaveData.available_paternity_leaves}
                        </td>
                      </tr>
                      {/* )} */}

                      {/* {leaveData.total_optional_holiday > 0 && (
                        <tr className="p-0">
                          <td className="p-0 ps-2">Optional Leave(s)</td>
                          <td className="p-0 text-center">{leaveData.total_optional_holiday}</td>
                          <td className="p-0 text-center">{leaveData.total_optional_holiday - leaveData.available_optional_holiday}</td>
                          <td className="p-0 text-center">{leaveData.available_optional_holiday}</td>
                        </tr>
                      )} */}
                      {/* {leaveData.total_sick_leaves > 0 && (
                        <tr className="p-0">
                          <td className="p-0 ps-2">Sick Leave(s)</td>
                          <td className="p-0 text-center">{leaveData.total_sick_leaves}</td>
                          <td className="p-0 text-center">{leaveData.total_sick_leaves - leaveData.available_sick_leaves}</td>
                          <td className="p-0 text-center">{leaveData.available_sick_leaves}</td>
                        </tr>
                      )} */}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-lg-12">
          <Card className="w-100 mb-2 ">
            <Card.Header className="pb-0">
              <Card.Title className="m-0 p-0">Upcoming Holiday(s)</Card.Title>
              <hr className="mb-0" />
            </Card.Header>
            <Card.Body className="pb-0 pt-0">
              <div className="overflow-auto">
                <Table hover className="">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th className="text-center">Day</th>
                      <th className="text-center">Holiday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingHolidays.map((leave, index) => (
                      <tr key={index} className="p-0 ">
                        <td className="p-0 ps-2">{leave.holiday_on}</td>
                        <td className="p-0 text-center">
                          {getDayOfWeek(leave.from_date)}
                        </td>
                        <td className="p-0 text-center">{leave.reason_for}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-lg-12">
          <Card className="w-100 mb-2 ">
            <Card.Header className="pb-0">
              <Card.Title className="m-0 p-0">Upcoming Leave(s)</Card.Title>
              <hr className="mb-0" />
            </Card.Header>
            <Card.Body className="pb-0 pt-0">
              <div className="overflow-auto">
                <Table hover className="">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th className="text-center">Day</th>
                      <th className="text-center">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingLeaves.map((leave, index) => (
                      <tr key={index} className="p-0 ">
                        <td className="p-0 ps-2">{leave.holiday_on}</td>
                        <td className="p-0 text-center">
                          {getDayOfWeek(leave.from_date)}
                        </td>
                        <td className="p-0 text-center">{leave.reason_for}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Statistics;
