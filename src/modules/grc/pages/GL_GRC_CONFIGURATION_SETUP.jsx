import { React, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Container } from "react-bootstrap";
import ConfigurationSetup from "src/components/forms/reactformutils/FormRuntimeEngine";
import { getviewData } from "../GrcService";

let viewParams = {
  viewName: "pa_gl_configurationsetup_bv",
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
      <Helmet title="GRC Configuration Setup" />
      <Container fluid className="p-0">
        <div>
          <ConfigurationSetup
            formService="configurationsetup"
            objectId={objectId}
          />
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Default;
