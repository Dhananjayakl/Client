import { useState, useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
const Message = ({ variant, children }) => {
  const [show, setShow] = useState(true);

  // On componentDidMount set the timer
  useEffect(() => {
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, []);

  // If show is false the component will return null and stop here
  if (!show) {
    return null;
  }

  return (
    <>
      <Alert show={show} variant={variant}>
        <Alert.Heading>{children}</Alert.Heading>

        <hr />
        {/* <div className="d-flex justify-content-end"> */}
        <Button onClick={() => setShow(false)} variant="`outline-${variant}`">
          Close
        </Button>
        {/* </div> */}
      </Alert>

      {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>}
    </>
  );
};

Message.defaultPros = {
  variant: "info",
};

export default Message;
