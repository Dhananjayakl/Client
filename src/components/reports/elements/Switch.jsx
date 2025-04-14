import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import axios from "src/utils/AxiosInstance";

const Switch = ({ value, row, columnMeta }) => {
  const [checked, setChecked] = useState(value);
  useEffect(() => {
    setChecked(value);
  }, [value]);

  const handleToggle = async () => {
    const newValue = !checked;
    setChecked(newValue);
    const userId = row?.original?.user_id;
    const apiUrl = `inactivateTheUser/${userId}/${newValue}`;

    try {
      await axios.put(apiUrl);
    } catch (error) {
      console.error("Error in toggling user activation", error);
    }
  };

  return (
    <Form>
      <Form.Check
        type="switch"
        id="custom-switch"
        checked={checked}
        onChange={handleToggle}
      />
    </Form>
  );
};
// export default Switch;

export default React.memo(Switch);
