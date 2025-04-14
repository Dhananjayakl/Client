import { Alert } from "react-bootstrap";

const FormErrorMessage = ({ submitTouched, errors }) => {
  const errorValues = Object.values(errors);

  return (
    <>
      {submitTouched && errorValues.length > 0 && (
        <Alert className="my-3" variant="danger">
          <div
            className="overflow-auto d-flex w-100 justify-content-start"
            style={{ maxHeight: "100px" }}
          >
            <ul className=" ms-0" style={{ width: "800px" }}>
              {errorValues.map((error, index) => (
                <li key={index} className="">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        </Alert>
      )}
    </>
  );
};

export default FormErrorMessage;
