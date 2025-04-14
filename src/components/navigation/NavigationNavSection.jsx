import React from "react";
import NavigationNavList from "./NavigationNavList";
import { Card, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const NavigationNavSection = (props) => {
  const { pages, className, ...rest } = props;
 const { t } = useTranslation("common");

  const groupedPages = {};

  if (pages) {
    pages.forEach((page) => {
      const title = page.title;
      if (!groupedPages[title]) {
        groupedPages[title] = [];
      }
      groupedPages[title].push(page.pages);
    });
  }

  const hasAdministration = groupedPages["Administration"];

  return (
    <React.Fragment {...rest}>
      <Row className="p-0 m-0">
        <Col
          lg={hasAdministration ? 9 : 12}
          md={12}
          sm={12}
          className="p-0 m-0"
        >
          {Object.entries(groupedPages).map(
            ([title, items]) =>
              title !== "Administration" && (
                <Col key={title}>
                  <Card>
                    <li className="text-black fs-4 p-2">{t(title)}</li>
                    {items.map((itemArray, index) => (
                      <NavigationNavList
                        pages={itemArray}
                        key={index}
                        depth={0}
                        maintitle={title}
                      />
                    ))}
                  </Card>
                </Col>
              )
          )}
        </Col>

        {hasAdministration && (
          <Col lg={3} md={12} sm={12} className="p-0 m-0">
            <Col className="ps-3">
              <Card>
                <li className="text-black fs-4 p-2">{t("Administration")}</li>
                {groupedPages["Administration"].map((itemArray, index) => (
                  <NavigationNavList
                    pages={itemArray}
                    key={index}
                    depth={0}
                    maintitle="Administration"
                  />
                ))}
              </Card>
            </Col>
          </Col>
        )}
      </Row>
    </React.Fragment>
  );
};

export default NavigationNavSection;
