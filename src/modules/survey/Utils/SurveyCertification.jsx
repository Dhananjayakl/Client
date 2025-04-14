import React from "react";

const SurveyCertification = () => {
  return (
    <div style={{ fontFamily: "", lineHeight: "1.6" }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          marginTop: "20px",
        }}
      >
        <h2>ABC COMPANY LTD.</h2>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>To,</p>
        <p>
          <strong>The Managing Director</strong>
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Sub:</strong> Compliance Certificate for the quarter ended
          August 2024 (updated as of August 6, 2024)
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>I hereby confirm that for the period indicated above there:</p>
      </div>

      <div style={{ marginBottom: "20px", paddingLeft: "20px" }}>
        <p>
          - has been due compliance with the regulatory provisions pertaining to
          department contained in the Regulatory Compliance Manual, to the
          extent applicable;
        </p>
        <p>
          - has been due compliance with the regulations as per annexure
          attached;
        </p>
        <p>
          - has been, to the best of my knowledge, no particular instances of
          non-compliance with applicable laws, rules, regulations other than
          those reported in the breach report;
        </p>
        <p>
          - has been no compliance issues that may cause damage to “ABC Life
          Insurance Company Ltd.” or “ABC Life” brand.
        </p>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <p>Signature - </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <p>
          <strong>Head of Department</strong>
        </p>
        <p>
          <strong>Functional Head</strong>
        </p>
      </div>

      <div>
        <p>Date: 06/08/2024</p>
        <p>Place: Mumbai</p>
      </div>
    </div>
  );
};

export default SurveyCertification;
