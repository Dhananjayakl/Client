import React, { useState } from "react";

const useVisibility = (initialFields) => {
  const [updatedFields, setUpdatedFields] = useState(initialFields);

  const toggleVisibility = () => {
    const fieldsCopy = { ...updatedFields };
    for (const key in fieldsCopy) {
      if (
        fieldsCopy[key] &&
        typeof fieldsCopy[key] === "object" &&
        "editable" in fieldsCopy[key]
      ) {
        fieldsCopy[key].editable = !fieldsCopy[key].editable;
      }
    }
    setUpdatedFields(fieldsCopy);
  };

  return { updatedFields, toggleVisibility };
};

export default useVisibility;
