import SurveyConfiguration from "src/components/forms/reactformutils/FormRuntimeEngine";
import { Row } from "react-bootstrap";

const Configuration = () => {
  return (
    <>
      <Row>
        <div className="ms-auto  mb-4 me-0">
          <SurveyConfiguration
            formService="surveyconfigurationsetup"
            objectId={1}
          />
        </div>
      </Row>
    </>
  );
};

export default Configuration;
