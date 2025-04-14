import { Card } from "react-bootstrap";
const Tabledetails = ({ title, apiResponse, fieldDetails }) => {
  return (
    <Card className="w-100" style={{ borderRadius: "30px" }}>
      {/* <Card.Title className=" custom-card-title d-flex justify-content-between ms-4 mt-3 small fw-normal lh-1_5"> */}
      {/* <h4>
        
          {title}{" "}
        </h4> */}
      {/* </Card.Title> */}

      <Card.Body className="custom-header" style={{ overflow: "auto" }}>
        {apiResponse && apiResponse.length > 0 && (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="custom-tables table text-nowrap">
              <thead>
                <tr>
                  {fieldDetails.map((field) => (
                    <th
                      key={field.key}
                      data-header={field.label}
                      title={field.label}
                      className="fs-5 fw-bold lh-1_5 text-center p-2 sticky-top"
                      style={{ zIndex: "1" }}
                    >
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiResponse.map((record, index) => (
                  <tr key={index}>
                    {fieldDetails.map((field) => {
                      const value = record[field.key];

                      return (
                        <td
                          key={field.key}
                          className="fs-5 fw-normal lh-1_5 text-center p-2 overflow-auto text-wrap "
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
export default Tabledetails;
