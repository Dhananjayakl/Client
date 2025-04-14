import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Section from "src/components/forms/reactformutils/fields/Section";

const ErrorAlert = ({ errors, formMetaData }) => {
  const generateAlertContent = () => {
    const rowMessages = {};
    const generalMessages = [];

    function extractFields(obj, currentRegion = null, currentRow = null) {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          const regionName = currentRegion || `region${index + 1}`;
          extractFields(item, regionName, index + 1);
        });
      } else if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).forEach((key) => {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            if (obj[key].message) {
              if (currentRegion !== null) {
                const region = currentRegion;
                const row =
                  currentRow !== null ? `Row ${currentRow}` : "general";

                if (!rowMessages[region]) {
                  rowMessages[region] = {};
                }
                if (!rowMessages[region][row]) {
                  rowMessages[region][row] = [];
                }
                rowMessages[region][row].push(obj[key].message);
              } else {
                generalMessages.push(obj[key].message);
              }
            }
            extractFields(obj[key], currentRegion || key, currentRow);
          }
        });
      }
    }

    extractFields(errors);

    const formatMessage = (message) => {
      if (message.includes("is required")) {
        const [beforeIsRequired, afterIsRequired] =
          message.split(/is\srequired/);
        return `
          <span>${beforeIsRequired}</span>
          <strong>is required</strong>
          ${afterIsRequired ? afterIsRequired : " "}
        `;
      }

      return `<span>${message}</span>`;
    };

    return (
      <div>
        {generalMessages.map((message, index) => (
          <div
            key={index}
            className="mb-2"
            style={{ fontSize: "18px", fontWeight: "bold" }}
          >
            <span className="text-danger">*</span>
            <span
              dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
            />
          </div>
        ))}

        {Object.keys(rowMessages).map((region, index) => {
          const regionTitle =
            formMetaData.regions[region]?.region_title || region;

          return (
            <div key={region} className="mb-3">
              <Section title={regionTitle} bgcolor={"#032D428F"} font={"18px"}>
                {Object.keys(rowMessages[region]).map((row, rowIndex) => (
                  <div key={`${region}-${row}`}>
                    {row !== "general" && <span>{row}:</span>}
                    <br />
                    {rowMessages[region][row].map((message, messageIndex) => (
                      <div
                        key={`${region}-${row}-${messageIndex}`}
                        className="mb-2 ps-3 mt-2"
                        style={{ fontSize: "18px" }}
                      >
                        <span className="text-danger me-2">*</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formatMessage(message),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </Section>
            </div>
          );
        })}
      </div>
    );
  };

  return <div>{generateAlertContent()}</div>;
};

export default ErrorAlert;
