import SimpleReport from "../../components/reports/SimpleReport";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Example({ dataFunction, service, columns, title }) {
  const [lgShow, setLgShow] = useState(false);

  return (
    <>
      <Button onClick={() => setLgShow(true)}>ChangeHistory</Button>

      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SimpleReport
            dataFunction={dataFunction}
            service={service}
            columns={columns}
            title={title}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Example;
