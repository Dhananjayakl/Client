import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import ConfigurationSetup from "src/components/forms/reactformutils/FormRuntimeEngine";
import { getviewData } from "../AdminService";
import { useEffect } from "react";
import { useState } from "react";

const FormLink = (props) => {
  let navigate = useNavigate();
  return (
    <Button
      variant="light"
      className="mx-2 text-dark"
      size="sm"
      onClick={() => navigate(`/form/runtime?formService=${props.form}`)}
    >
      {props.title}
    </Button>
  );
};

let viewParams = {
  viewName: "pa_configuration_bt",
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
        const responseData = response.data;
        if (responseData.data.length > 0) {
          setObjectId(responseData.data[0].object_id);
        } else {
          setObjectId(-1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [viewParams]);

  return (
    <React.Fragment>
      <Helmet title="System Configuration" />
      <Container fluid className="p-0">
        <div>
          <ConfigurationSetup formService="configuration" objectId={objectId} />
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Default;
