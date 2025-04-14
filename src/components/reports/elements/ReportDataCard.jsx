import React, { useState } from "react";
import { Row, Col, Card, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faCompress,
  faIndianRupee,
  faRupeeSign,
  faDollarSign,
  faShekelSign,
} from "@fortawesome/free-solid-svg-icons";
import ReportRuntime from "src/components/reports/Report";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const getCurrencyFormat = (currency, value) => {
  switch (currency) {
    case "₹ - Rupees":
      return {
        icon: <FontAwesomeIcon icon={faIndianRupee} />,
        formattedValue: new Intl.NumberFormat("en-IN").format(value),
      };
    case "$ - Dollar":
      return {
        icon: <FontAwesomeIcon icon={faDollarSign} />,
        formattedValue: new Intl.NumberFormat("en-US", {}).format(value),
      };
    case "AED - United Arab Emirates dirham":
      return {
        icon: <FontAwesomeIcon icon={faShekelSign} />,
        formattedValue: new Intl.NumberFormat("ar-AE", {}).format(value),
      };
    default:
      return {
        icon: <FontAwesomeIcon icon={faIndianRupee} />,
        formattedValue: new Intl.NumberFormat("en-IN", {}).format(value),
      };
  }
};

const ReportDataCard = ({
  data,
  reportMeta,
  defaultdataExpression,
  defaultFilterExpression,
  yearProp,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [reportFilter, setReportFilter] = useState({});
  const { t } = useTranslation("common");
  const handleClose = () => {
    setShowModal(false);
    setFullscreen(false);
  };

  const handleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const { d_system_currency } = useSelector(
    (state) => state.systemConfig.systemConfig
  );
  const { icon, formattedValue } = getCurrencyFormat(
    d_system_currency,
    data?.aggregateValue
  );

  const handleModalShow = (card, record) => {
    const firstEntry = record && Object.entries(record)[0];
    const firstValue = firstEntry ? firstEntry[1] : null;
    if (card) {
      if (record && firstValue) {
        let filterValue;
        if (defaultFilterExpression || defaultdataExpression) {
          filterValue =
            (defaultFilterExpression || defaultdataExpression || "") +
            (card.card_column && firstValue
              ? ` AND ${card.card_column}='${firstValue}'`
              : "");
        } else {
          filterValue = `${card.card_column}='${firstValue}'`;
        }

        setReportFilter(filterValue);
      } else {
        const reportFilter = defaultFilterExpression
          ? `${defaultFilterExpression} AND ${card.card_column} IS NULL`
          : `${card.card_column} IS NULL`;

        setReportFilter(reportFilter);
      }
    } else {
      setReportFilter(defaultFilterExpression || defaultdataExpression || "");
    }
    setShowModal(true);
    setFullscreen(true);
  };

  // if (!data || !data.dataCards) {
  //   return <div>No data available</div>;
  // }

  const numCards = reportMeta.dataCards?.length || 0;
  const colSize =
    numCards === 0 ? 12 : numCards === 1 ? 6 : numCards === 2 ? 4 : 3;

  //Adding Shimmers to Data Cards Starts
  const ShimmerCard = ({ colSize }) => (
    <Col xl={colSize} lg={colSize} md={colSize} sm={12} className="d-flex">
      <Card className="flex-fill reportChart-cards">
        <Card.Header className="p-2">
          <div className="shimmer shimmer-card-header"></div>
        </Card.Header>
        <Card.Body className="p-2">
          <div className="shimmer shimmer-card-body"></div>
        </Card.Body>
      </Card>
    </Col>
  );

  if (data === false || data === undefined || !data.dataCards) {
    const shimmerCount = 2;
    const colSize = 6;
    return (
      <Row className="p-0 m-0">
        {Array.from({ length: shimmerCount }).map((_, index) => (
          <ShimmerCard key={index} colSize={colSize} />
        ))}
      </Row>
    );
  }
  //Adding Shimmers to Data Cards Ends

  return (
    <>
      <Row className="p-0 m-0">
        {reportMeta?.reportInfo?.data_card_title && (
          <Col
            className="d-flex"
            xl={colSize}
            lg={colSize}
            md={colSize}
            sm={12}
          >
            <Card className="flex-fill reportChart-cards">
              <Card.Header
                className="h5 border-bottom p-2"
                style={{
                  backgroundColor: `${reportMeta?.reportInfo?.data_card_background_color}`,
                  color: `${reportMeta?.reportInfo?.data_card_text_color}`,
                }}
              >
                {t(reportMeta?.reportInfo?.report_title)}
              </Card.Header>
              <Card.Body className="py-2">
                {/* <Row className="h5 border-bottom p-1">
                  {reportMeta?.reportInfo?.report_title}
                </Row> */}
                <span className="h2 pt-3 ps-2">
                  {!reportMeta?.reportInfo?.enable_total_operation ? (
                    <a
                      // className="text-decoration-underline"
                      onClick={() => handleModalShow()}
                    >
                      <span className="text-decoration-underline">
                        {data.totalRecords}
                      </span>
                    </a>
                  ) : (
                    // <span>
                    //   <a
                    //     className="underline-link"
                    //     onClick={() => handleModalShow()}
                    //   >
                    //     <FontAwesomeIcon icon={faIndianRupee} />{" "}
                    //     {/* {data.aggregateValue} */}
                    //     {new Intl.NumberFormat("en-IN").format(
                    //       data.aggregateValue
                    //     )}
                    //   </a>
                    //   {/* {Number(data.totalRecords).toFixed(2)} */}
                    // </span>
                    <span>
                      <a
                        // className="underline-link "
                        onClick={() => handleModalShow()}
                      >
                        {icon && <span>{icon} </span>}
                        <span className="text-decoration-underline">
                          {formattedValue}
                        </span>
                      </a>
                    </span>
                  )}
                </span>
              </Card.Body>
            </Card>
          </Col>
        )}

        {reportMeta.dataCards
          ?.filter((item) => item.is_pivot !== true)
          .map((item) => (
            <Col
              xl={colSize}
              lg={colSize}
              md={colSize}
              sm={12}
              className="d-flex"
              key={item.card_id}
            >
              <Card className="flex-fill reportChart-cards rounded-circle-0">
                <Card.Header
                  className="h5 border-bottom p-2"
                  style={{
                    backgroundColor: `${item?.background_color}`,
                    color: `${item?.text_color}`,
                  }}
                >
                  {t(item.card_title)}
                </Card.Header>
                <Card.Body className="py-2">
                  {/* <Row
                        className="h5 border-bottom p-1"
                        style={{ backgroundColor: `${item?.background_color}` }}
                      >
                        {item.card_title}
                      </Row> */}
                  {data.dataCards[item.card_column]?.length > 0 ? (
                    <div>
                      {data.dataCards[item.card_column].map((rec, index) => {
                        const firstEntry = Object.entries(rec)[0];
                        const firstValue = firstEntry ? firstEntry[1] : null;

                        return (
                          <div
                            className="d-flex justify-content-between pe-2"
                            key={index}
                          >
                            <ul className="p-0 ps-2 m-0">
                              <li>
                                <span className="h5 pe-2" md={10}>
                                  {firstValue !== null &&
                                  firstValue !== undefined
                                    ? firstValue
                                    : "[--]"}
                                </span>
                              </li>
                            </ul>

                            <span className="h6 pt-1" md={2}>
                              {rec.aggregatednumber > 0 ? (
                                <a
                                  className="underline-link"
                                  onClick={() => handleModalShow(item, rec)}
                                >
                                  {rec.aggregatednumber}
                                </a>
                              ) : (
                                <span>{rec.aggregatednumber || 0}</span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="h2 pt-3 ps-2">
                      <a
                        className="underline-link"
                        onClick={() => handleModalShow(item, 0)}
                      >
                        0
                      </a>
                    </span>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      <Modal
        show={showModal}
        fullscreen={fullscreen}
        onHide={handleClose}
        size="lg"
        className="modalviewport"
      >
        <Modal.Header className="d-flex justify-content-between align-items-center ">
          <Button
            variant="link"
            onClick={handleFullscreen}
            className="p-0 border-0"
          >
            <FontAwesomeIcon
              icon={fullscreen ? faCompress : faExpand}
              className="text-dark"
            />
          </Button>

          <Button variant="secondary" onClick={handleClose}>
            {t("Close")}
          </Button>
        </Modal.Header>
        <Modal.Body size="lg">
          <ReportRuntime
            report={reportMeta?.reportInfo?.report_name}
            ChartdrilldownReports={reportFilter}
            yearProp={yearProp}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

// export default ReportDataCard;
export default React.memo(ReportDataCard);
