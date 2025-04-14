import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
// import FormControl from "src/components/forms/reactformutils/FormControl"\
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_LM_LEAVE_CONFIGURATION_JS";
import { useState, useEffect } from "react";
import { getviewData } from "../LeaveService";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Section from "src/components/forms/reactformutils/fields/Section";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    formValues,
  } = props;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formMetaData,
    formValues
  );

  const [errorMessage, seterrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // const [years, setYear] = useState("");
  const [emptype, setEmptype] = useState([]);
  const [region, setregion] = useState("");
  const [fiscalyear, setfiscalyear] = useState("");

  form.effectiveFrom.onChange(function (value) {
    formMethods.setValue("effectiveUntil", "");
  });

  let fromDate = formMethods.getValues("effectiveFrom");
  let Year = new Date(fromDate).getFullYear();

  form.empType.onChange(function (value) {
    if (value) {
      const selectedValues = value.map((key) => key.value);
      setEmptype(selectedValues.toString());
    }
  });

  form.region.onChange(function (value) {
    setregion(value);
  });

  form.fiscalYearStarts.onChange(function (value) {
    setfiscalyear(value);
  });

  let filterExpression;
  // filterExpression = `year=${years} and ARRAY[${emptype}] && emp_type and region=${region} and fiscal_year_starts=${fiscalyear}`;
  filterExpression = `year=${Year} and region=${region} and fiscal_year_starts=${fiscalyear} and exists (select 1 from unnest(emp_type) as u where u in (${emptype}))`;

  const viewParams = {
    viewName: "pa_lm_leave_configuration_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: filterExpression,
  };

  useEffect(() => {
    if (Year && emptype && region && fiscalyear) {
      if (emptype.length > 0) {
        getviewData(viewParams)
          .then((response) => {
            if (response.data.totalRecords > 0) {
              seterrorMessage(
                "The selected Region, Financial Year, Year and Employee Type is already exists, please select different."
              );
            } else {
              seterrorMessage(false);
              setSuccessMessage(null);
            }
          })
          .catch((err) => {
            console.log(err);
            seterrorMessage(false);
            setSuccessMessage(null);
          });
      }
    } else {
      seterrorMessage(false);
    }
  }, [Year, emptype, region, fiscalyear]);

  const disabledButton = document.querySelector(".disbutton");

  if (disabledButton != null || disabledButton != undefined) {
    if (errorMessage) {
      disabledButton.hidden = true;
    } else {
      disabledButton.hidden = false;
    }
  }

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <FormControl
            control={control}
            name="region"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="fiscalYearStarts"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        <Row>
          <FormControl
            control={control}
            name="year"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              type="date"
              name="effectiveFrom"
              formMetaData={formMetaData}
              formMethods={formMethods}
              watchFor="effectiveUntil"
              futureDate={true}
            />
          </div>
          <div className="col-md-6">
            <FormControl
              control={control}
              type="date"
              name="effectiveUntil"
              formMetaData={formMetaData}
              formMethods={formMethods}
              watchFor="effectiveFrom"
              futureDate={true}
              futureDateValue={formMethods.getValues("effectiveFrom")}
            />
          </div>
        </Row>
        <Row>
          <FormControl
            control={control}
            type="PicklistSelect"
            name="empType"
            formMetaData={formMetaData}
            formMethods={formMethods}
            isMulti={true}
          />
        </Row>
        {errorMessage ? (
          <div className="text-danger p-1">{errorMessage}</div>
        ) : (
          successMessage && <div>{successMessage}</div>
        )}
        <Row>
          <FormControl
            control={control}
            type="PicklistSelect"
            isMulti={true}
            name="workDays"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="leaveCreditByAnnually"
            formMetaData={formMetaData}
            formMethods={formMethods}
            watchFor="leaveCreditByAnnually"
          />
        </Row>
        <FormControl
          control={control}
          name="allowSubSequentElnCL"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
        <FormControl
          control={control}
          name="isLeaveSuffixApplicable"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
        {/* <Row>
          <FormControl
            control={control}
            type="PicklistSelect"
            isMulti={true}
            name="leaveTypes"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row> */}
        <Row>
          <Row>
            <FormControl
              control={control}
              name="ledgerRefresh"
              formMetaData={formMetaData}
              formMethods={formMethods}
              watchFor="leaveCreditByAnnually"
            />
          </Row>
          <FormControl
            control={control}
            name="earnedLeaves"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        {/* <Row>
          <FormControl
            control={control}
            type="number"
            name="sickLeaves"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row> */}

        <Row>
          <FormControl
            control={control}
            name="casualLeaves"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="maternityLeaves"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        <Row>
          <FormControl
            control={control}
            name="paternityLeaves"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        {/* <Row>
          <FormControl
            control={control}
            type="number"
            name="optionalHoliday"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row> */}

        <Row>
          <FormControl
            control={control}
            name="carryForward"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="isMedicalCertReq"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="noOfDays"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        <Row>
          <FormControl
            control={control}
            name="attachments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Container>
      {formValues.objectId != null && (
        <Container className="justify-content-center  ">
          <Section title="Comments and Change History">
            <AuditTrail
              formMetaData={formMetaData}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
            />
          </Section>
        </Container>
      )}
    </>
  );
};

export default FormLayout;
