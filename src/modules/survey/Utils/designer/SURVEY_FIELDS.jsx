import React from "react";
import { useDrag } from "react-dnd";

const SurveyFields = ({ fieldName, icon }) => {
  const [{ isDraggingField }, dragField] = useDrag(() => ({
    type: "question",
    item: { FieldName: fieldName },
    collect: (monitor) => ({
      isDraggingField: !!monitor.isDragging(),
    }),
  }));

  return (
   
      <span ref={dragField} className={`${isDraggingField ? "text-info active" : "text-dark form-label p-0 m-0"}`}>
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()}
      </span>
   
  );
};

export default SurveyFields;
