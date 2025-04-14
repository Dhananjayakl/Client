import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import ConfigurationSetup from "src/components/forms/reactformutils/FormRuntimeEngine";
import { getviewData } from "../lossFormService";
import { useEffect } from "react";
import { useState } from "react";

let viewParams = {
  viewName: "pa_le_configuration_setup_bv",
  pageNumber: 0,
  pageSize: 0,
  sortField: "",
  sortOrder: "",
  orderExpression: "",
  filterExpression: "",
};

const Default = () => {
  const [objectId, setObjectId] = useState("");
  useEffect(() => {
    getviewData(viewParams)
      .then((response) => {
        const responseData = response.data.data;
        console.log("pa_le_configuration_setup_bv", responseData[0].object_id);
        if (responseData.length > 0) {
          setObjectId(responseData[0].object_id);
        } else {
          setObjectId(1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [viewParams]);

  return (
    <React.Fragment>
      <Helmet title="IR Configuration Setup" />
      <Container fluid className="p-0">
        <div>
          <ConfigurationSetup
            formService="lossconfigurationsetup"
            objectId={objectId}
          />
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Default;
