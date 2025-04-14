import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useState, useEffect } from "react";
import axios from "src/utils/AxiosInstance";
//   import { WarnUserBeforeReloadOrExit } from "src/Warnuser";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    runtimeParams,
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
    fieldTitles,

    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  const [formdata, setformdata] = useState(null);
  const [uploadType, setUploadType] = useState(null);
  useEffect(() => {
    const uploadImage = async () => {
      const logoformData = new FormData();
      const filename = `${uploadType}`;
      logoformData.append("image", formdata, filename);

      try {
        const response = await axios.post(
          `logoConfig/uploadLogoImg`,
          logoformData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } catch (error) {
        console.error("Upload failed", error);
      }
    };

    uploadImage();
  }, [formdata]);

  return (
    <>
      <Col md={6}>
        <Col>
          <FormControl
            control={control}
            name="dateFormat"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>

        <Col>
          <FormControl
            control={control}
            name="dataTimeFormat"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>

        <Col>
          <FormControl
            control={control}
            name="systemCurrency"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>

        <Col>
          <FormControl
            control={control}
            name="fiscalYearStarts"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>

        <Col>
          <FormControl
            control={control}
            name="stickyLogo"
            formMetaData={formMetaData}
            formMethods={formMethods}
            setformdata={(file) => {
              setformdata(file);
              setUploadType("stickyLogo");
            }}
          />
          <span>Recommended Dimension W-200px & H-65px</span>
        </Col>
        <Col>
          <FormControl
            control={control}
            name="compactLogo"
            formMetaData={formMetaData}
            formMethods={formMethods}
            setformdata={(file) => {
              setformdata(file);
              setUploadType("compactLogo"); // Set type
            }}
          />
          <span className="form-label">
            Recommended Dimension W-80px & H-60px
          </span>
        </Col>
      </Col>
    </>
  );
};
export default FormLayout;
