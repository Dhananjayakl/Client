import React, { useEffect, useState, useRef } from "react";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { util } from "src/Progrec";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Container,
  Form,
  Row,
  ButtonToolbar,
  Col,
  ButtonGroup,
  Card,
  Accordion,
  Tabs,
  Tab,
  Nav,
  Modal,
} from "react-bootstrap";
import {
  faCircleInfo,
  faKey,
  faList,
  faShieldHalved,
  faTrashAlt,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

let Grid = (props) => {
  let {
    formMetaData,
    formMethods,
    region,
    helpers,
    columns,
    parentFilter,
    actions,
    formValues,
    disableOnNextStage,
    futureDate,
  } = props;

  // {parentFilter:{fkColumn:docVendorId,value:value}}
  console.log("Grid:formMetaData", formMetaData);
  const { t } = useTranslation("common");
  let regionTitle = util.getRegionTitle(region, formMetaData);

  let keyColumn = null;
  for (const [key, value] of Object.entries(formMetaData.fields)) {
    if (value.region_code == region) {
      let finalVal = { [key]: [value] };
      console.log(finalVal, "Grid:final iterated val");
      if (value.is_key_column) {
        keyColumn = key;
      }
    }
    // console.log(value, key, "valhala");
  }

  if (!helpers) {
    helpers = useFieldArray({
      name: region,
      control: formMethods.control,
    });
  }

  console.log("Grid:helpers", helpers, columns, keyColumn);
  let editable;
  return (
    <>
      <Row>
        {formMetaData.formmeta.accessCode == 1 &&
          (actions?.add || actions?.add === undefined) && (
            <Button
              variant="primary"
              onClick={() => {
                if (parentFilter) {
                  helpers.append(
                    {
                      [keyColumn]: "",
                      [parentFilter?.fkColumn]: parentFilter?.value,
                    },
                    { shouldFocus: false }
                  );
                } else {
                  helpers.append(
                    {
                      [keyColumn]: "",
                    },
                    { shouldFocus: false }
                  );
                }
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} size="lg" /> {t("Add")}{" "}
              {regionTitle ? t(regionTitle) : "Record"}
            </Button>
          )}
      </Row>

      <div style={{ overflowX: "auto" }}>
        {/* {helpers.fields.map((row, rowIndex) => ( */}
        <Row
          className="py-2 text-secondary" //added color to get visible in the dark mode
          style={{
            flexWrap: "nowrap",
            display: "flex",
            backgroundColor: "#f9f9f9",
          }}
        >
          {formMetaData.formmeta.accessCode == 1 &&
            (actions?.remove || actions?.remove === undefined) && (
              <div
                className="me-2 col-md-1 "
                style={{ width: "20px" }}
                // style={
                //   rowIndex == 0
                //     ? { marginTop: "3%", width: "20px" }
                //     : { width: "20px" }
                // }
              >
                <FontAwesomeIcon icon={faTrashAlt} size="lg" />
              </div>
            )}

          {columns &&
            columns.length > 0 &&
            columns.map((column, fieldIndex) => {
              let columnName = "";
              let length = 3;
              if (typeof column === "string" || column instanceof String) {
                columnName = column;
              } else {
                columnName = column.name;
                if (column.length) {
                  length = column.length;
                }
              }

              return (
                <div className={`col-md-${length} me-2`}>
                  {t(util.getFieldTitle(columnName, formMetaData))}
                  {/* <FormControl
                      zIndex={true}
                      name={`${region}.${rowIndex}.${columnName}`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      setData={true}
                      hideTitle={rowIndex > 0 ? true : false}
                      grid
                    /> */}
                </div>
              );
            })}
        </Row>
        <hr className="mt-0 p-0" />
        {/* ))} */}

        {helpers.fields.length == 0 && (
          <div className="p-3">
            <center>
              {t("No")} {regionTitle ? t(regionTitle) : "Record"}{" "}
              {t("Available")}
            </center>
          </div>
        )}
        {helpers.fields.map((row, rowIndex) => {
          if (
            parentFilter &&
            formMethods.getValues(
              `${region}.${rowIndex}.${parentFilter?.fkColumn}`
            ) != parentFilter.value
          ) {
            return null;
          }
          return (
            // if(!parentFilter || parentFilter)

            <Row key={row.id} style={{ flexWrap: "nowrap", display: "flex" }}>
              {formMetaData.formmeta.accessCode == 1 &&
                (actions?.remove || actions?.remove === undefined) && (
                  <div
                    className="me-2 col-md-1 "
                    style={
                      // rowIndex == 0
                      //   ? { marginTop: "3%", width: "20px" }
                      //   : { width: "20px" }
                      { width: "20px" }
                    }
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      color="#FF0000"
                      onClick={() => helpers.remove(rowIndex)}
                      style={{ cursor: "pointer" }}
                      size="lg"
                    />
                  </div>
                )}

              {columns &&
                columns?.length > 0 &&
                columns?.map((column, fieldIndex) => {
                  let columnName = "";
                  let length = 3;
                  if (typeof column === "string" || column instanceof String) {
                    columnName = column;
                  } else {
                    columnName = column.name;
                    if (column.length) {
                      length = column.length;
                    }
                  }

                  if (disableOnNextStage != undefined) {
                    editable = disableOnNextStage
                      ? formValues[region]?.[rowIndex]?.[columnName]
                      : undefined;
                  }

                  return (
                    <div className={`col-md-${length} me-2`}>
                      <FormControl
                        zIndex={true}
                        name={`${region}.${rowIndex}.${columnName}`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        setData={true}
                        // hideTitle={rowIndex > 0 ? true : hfalse}
                        hideTitle
                        futureDate={futureDate || undefined}
                        disabled={
                          disableOnNextStage
                            ? editable !== undefined
                              ? true
                              : false
                            : undefined
                        }
                        grid
                      />
                    </div>
                  );
                })}
            </Row>
          );
        })}
      </div>
    </>
  );
};

export default Grid;
