import React, { useEffect, useState, Suspense } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "src/utils/AxiosInstance";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import { Modal, Button } from "react-bootstrap";
import Loader from "src/components/Loader";

const Pages = (props) => {
  const [PageLayout, setPageLayout] = useState(null);
  const [pageResponse, setPageResponse] = useState(true);
  const [loading, setLoading] = useState(true);

  let pageKey = props.id;
  let pageKeyColumn = "page_id";
  if (!pageKey) {
    pageKey = props.pageName;
    pageKeyColumn = "page_name";
  }
  if (!pageKey) {
    const [searchParams] = useSearchParams();
    pageKey = searchParams.get("id");
    pageKeyColumn = "page_id";
    if (!pageKey) {
      pageKey = searchParams.get("name");
      pageKeyColumn = "page_name";
    }
  }
  const navigate = useNavigate();
  const location = useLocation();
  const onClickCloseBtn = () => {
    if (location.state?.from) {
      navigate(location.state.from); // Going  back to the previous page if available
    } else {
      navigate("/"); // Going to the home page as a fallback
    }
  };

  useEffect(() => {
    if (!pageKey) return;

    const getPageInfo = async (pageKey) => {
      try {
        const response = await axios.get(`getPageInfo?idOrPageName=${pageKey}`);
        const pageInfo = response.data;
        const acronym_app = pageInfo.acronym_app;
        const pageName = pageInfo.page_name;
        const accessCode = pageInfo.accessCode;
        if (accessCode === 1) {
          if (acronym_app && pageName) {
            try {
              const lazyImport = () =>
                import(`../../modules/${acronym_app}/pages/${pageName}.jsx`);
              const component = await lazyImport();
              if (component && component.default) {
                setPageLayout(() => component.default);
              } else {
                throw new Error("Invalid component");
              }
              setPageResponse(true);
            } catch (error) {
              console.error("Error importing the page:", error);
              const fallbackImport = () => import("../../pages/auth/Page404");
              const fallbackComponent = await fallbackImport();
              if (fallbackComponent && fallbackComponent.default) {
                setPageLayout(() => fallbackComponent.default);
              } else {
                throw new Error("Invalid fallback component");
              }
              setPageResponse(true);
            }
          }
        } else {
          setPageResponse(false);
        }
      } catch (error) {
        setPageResponse(false);
      } finally {
        setLoading(false);
      }
    };
    getPageInfo(pageKey);
  }, [pageKey]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!pageResponse) {
    return (
      <Modal size="md" centered show={true}>
        <Modal.Header>
          <Modal.Title className="text-primary-emphasis">
            Access Denied
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex me-2">
          <ExclamationTriangleFill
            className="bi flex-shrink-0 me-2 mt-1 text-warning"
            width="45"
            height="45"
          />
          <h4 className="ms-1 fw-medium text-primary-emphasis">
            Unfortunately, you don't have the necessary permissions to view or
            edit the page details. Please contact the System Administrator.
          </h4>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClickCloseBtn}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Suspense
      fallback={
        <div>
          <Loader />
        </div>
      }
    >
      {PageLayout ? <PageLayout /> : <div>Page not found</div>}
    </Suspense>
  );
};

export default Pages;
