import React, { useEffect, useState } from "react";
import BusinessUnitTree from "../pages/BusinessUnitTree";
import { useSearchParams } from "react-router-dom";
import { getBusinessUnit } from "../AdminService";
import { Tabs, Tab } from "react-bootstrap";

const Default = (props) => {
  const [searchParams] = useSearchParams();
  const [entityAllBusinessUnit, setEntityAllBusinessUnit] = useState([]);
  const [userId, setUserId] = useState(null);

  // Get currentLoggedUser from localStorage and extract userId
  useEffect(() => {
    const currentLoggedUser = JSON.parse(
      localStorage.getItem("current_logged_User")
    );

    if (
      currentLoggedUser &&
      currentLoggedUser[0] &&
      currentLoggedUser[0].user_details &&
      currentLoggedUser[0].user_details.data
    ) {
      const cUserId = currentLoggedUser[0].user_details.data[0].user_id;
      setUserId(cUserId); // Set userId state
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Get objectId from URL and update entityAllBusinessUnit
  useEffect(() => {
    const objectId = searchParams.get("objectId");
    console.log(objectId, "coming the objectId");

    if (userId) {
      getBusinessUnit("getBusinessUnit", userId).then((data) => {
        console.log("dataaaaaaaaaa", data);
        setEntityAllBusinessUnit(data.data); // Update with the response data
      });
    }
  }, [searchParams, userId]); // Run this effect when searchParams or userId changes

  return (
    <div
      style={{
        display: "flex", // Use flexbox for horizontal layout
        flexWrap: "wrap", // Allow wrapping if necessary
        overflowX: "auto", // Enable horizontal scrolling if necessary
      }}
    >
      <Tabs defaultActiveKey={0} id="business-unit-tabs">
        {entityAllBusinessUnit &&
          entityAllBusinessUnit.map((e, index) => (
            <Tab
              eventKey={index}
              title={`Business Unit ${index + 1}`}
              key={index}
            >
              <div style={{ padding: "10px", width: "100%" }}>
                <BusinessUnitTree businessUnitId={e} />
              </div>
            </Tab>
          ))}
      </Tabs>
    </div>
  );
};

export default Default;
